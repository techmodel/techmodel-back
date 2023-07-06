import { In, LessThan, MoreThan } from 'typeorm';
import { skillToVolunteerRequestRepository } from '.';
import { volunteerRequestToVolunteerRepository } from '../../tests/seed';
import { appDataSource } from '../dataSource';
import { NotFoundError } from '../exc';
import { RequestStatus, VolunteerRequest, VolunteerRequestToVolunteer } from '../models';
export const volunteerRequestRepository = appDataSource.getRepository(VolunteerRequest).extend({
  async relevantAndOpen(volunteerId: string): Promise<VolunteerRequest[]> {
    return await this
      // alias to VolunteerRequest
      .createQueryBuilder('vr')
      // populate vr.currentVolunteers
      .loadRelationCountAndMap('vr.currentVolunteers', 'vr.volunteerRequestToVolunteer')
      .leftJoinAndSelect('vr.skillToVolunteerRequest', 'stvr')
      .leftJoinAndSelect('vr.volunteerRequestToVolunteer', 'vrtv')
      .leftJoinAndSelect('vrtv.volunteer', 'vol')
      .leftJoinAndSelect('vol.company', 'company')
      .leftJoinAndSelect('vr.program', 'program')
      .leftJoinAndSelect('vr.creator', 'creator')
      .leftJoinAndSelect('stvr.skill', 'skill')
      .andWhere(`vr.status = :status`, { status: 'sent' })
      .andWhere(`(vrtv.volunteerId != '${volunteerId}' OR vrtv.volunteerId is null)`) // narrow down the requests as much as possible
      // filter out requests that are full
      .andWhere(qb => {
        const subQuery = qb
          .subQuery()
          .select('vr.id')
          .from(VolunteerRequest, 'vr')
          .leftJoin('vr.volunteerRequestToVolunteer', 'vrtv')
          .groupBy('vr.id, vr.totalVolunteers')
          .andHaving('COUNT(vrtv.volunteerRequestId) < vr.totalVolunteers')
          .getQuery();
        return 'vr.id IN ' + subQuery;
      })
      // filter out requests that the user is already assigned to
      .andWhere(qb => {
        const subQuery = qb
          .subQuery()
          .select('vrtv.volunteerRequestId')
          .from(VolunteerRequestToVolunteer, 'vrtv')
          .where(`vrtv.volunteerId = '${volunteerId}'`)
          .groupBy('vrtv.volunteerRequestId')
          .getQuery();
        return 'vr.id NOT IN ' + subQuery;
      })
      .getMany();
  },

  async requestsOfProgram(programId: number, institutionId?: number): Promise<VolunteerRequest[]> {
    let qb = this
      // alias to VolunteerRequest
      .createQueryBuilder('vr')
      // populate vr.currentVolunteers
      .loadRelationCountAndMap('vr.currentVolunteers', 'vr.volunteerRequestToVolunteer')
      .leftJoinAndSelect('vr.skillToVolunteerRequest', 'stvr')
      .leftJoinAndSelect('vr.program', 'program')
      .leftJoinAndSelect('vr.creator', 'creator')
      .leftJoinAndSelect('stvr.skill', 'skill')
      .leftJoinAndSelect('vr.volunteerRequestToVolunteer', 'vrtv')
      .leftJoinAndSelect('vrtv.volunteer', 'vol')
      .leftJoinAndSelect('vol.company', 'company')
      .andWhere(`vr.programId = :programId`, { programId })
      .andWhere(`vr.status = :status`, { status: 'sent' });
    if (institutionId) {
      qb = qb.andWhere(`vr.institutionId = :institutionId`, { institutionId });
    }
    return qb.getMany();
  },

  async assignVolunteerToRequest(requestId: number, volunteerId: string): Promise<void> {
    await appDataSource
      .getRepository(VolunteerRequestToVolunteer)
      .insert({ volunteerId, volunteerRequestId: requestId });
    // TODO: handle concurrent inserts (it should be inside the transaction)
    //  OR
    //    we can use insert ... select ..., and that way we will insert only
    //    when the select returns something, and the where clause in the select
    //    will check that the request has a right number of assigns. when we get
    //    back the result from the query we will check that something was inserted,
    //    if it did not insert anything, then we will throw an error
  },

  async volunteerRequestsByVolunteerId(volunteerId: string): Promise<VolunteerRequest[]> {
    return await this
      // alias to VolunteerRequest
      .createQueryBuilder('vr')
      // populate vr.currentVolunteers
      .loadRelationCountAndMap('vr.currentVolunteers', 'vr.volunteerRequestToVolunteer')
      .leftJoinAndSelect('vr.skillToVolunteerRequest', 'stvr')
      .leftJoinAndSelect('vr.program', 'program')
      .leftJoinAndSelect('stvr.skill', 'skill')
      .leftJoinAndSelect('vr.creator', 'creator')
      .leftJoin('vr.volunteerRequestToVolunteer', 'vrtv')
      .andWhere('vrtv.volunteerId = :volunteerId', { volunteerId })
      .andWhere(`vr.status = :status`, { status: 'sent' })
      .getMany();
  },

  async requestById(id: number): Promise<VolunteerRequest | null> {
    return await this.findOne({ where: { id }, relations: ['volunteerRequestToVolunteer'] });
  },

  async deleteVolunteerFromRequest(requestId: number, volunteerId: string): Promise<void> {
    const deleteRes = await appDataSource
      .getRepository(VolunteerRequestToVolunteer)
      .delete({ volunteerId, volunteerRequestId: requestId });
    if (deleteRes.affected === 0) {
      throw new NotFoundError('Volunteer is not mapped to the request');
    }
  },

  async setVolunteerRequestAsDeleted(requestId: number): Promise<void> {
    await this.update({ id: requestId }, { status: RequestStatus.DELETED, updatedAt: new Date() });
  },

  async unassignFromOpenRequests(volunteerId: string): Promise<void> {
    const today = new Date().toISOString();
    const mappingsToDelete = await volunteerRequestToVolunteerRepository
      .createQueryBuilder('vrtv')
      .innerJoinAndSelect('vrtv.volunteerRequest', 'vr')
      .where('vrtv.volunteerId = :volunteerId', { volunteerId })
      .andWhere('vr.endDate >= :today', { today })
      .select('vrtv.id')
      .getMany();
    const idsToDelete = mappingsToDelete.map(mapping => mapping.id);
    await volunteerRequestToVolunteerRepository
      .createQueryBuilder('vrtv')
      .delete()
      .whereInIds(idsToDelete)
      .execute();
  },
  async updateCreatorIdForOldRequests(oldId: string, newId: string) {
    const today = new Date();
    const vrsToUpdate = await this.find({
      where: {
        creatorId: oldId,
        endDate: LessThan(today)
      }
    });
    const idsToUpdate = vrsToUpdate.map(vr => vr.id);
    await this.update({ id: In(idsToUpdate) }, { creatorId: newId });
  },
  async deleteFutureRequestsByCreator(creatorId: string) {
    const today = new Date();
    const vrsToDelete = await this.find({
      where: {
        creatorId,
        endDate: MoreThan(today)
      }
    });
    const ids = vrsToDelete.map(vr => vr.id);
    await Promise.all([
      volunteerRequestToVolunteerRepository.delete({ volunteerRequestId: In(ids) }),
      skillToVolunteerRequestRepository.delete({ volunteerRequestId: In(ids) })
    ]);
    await this.remove(vrsToDelete);
  },
  async updateVolunteerIdForOldRequests(oldId: string, newId: string) {
    const today = new Date();
    const vrsToUpdate = await this.find({
      where: {
        endDate: LessThan(today),
        volunteerRequestToVolunteer: {
          volunteerId: oldId
        }
      },
      relations: {
        volunteerRequestToVolunteer: true
      }
    });
    const idsToUpdate = vrsToUpdate.flatMap(vr => vr.volunteerRequestToVolunteer.map(vrtv => vrtv.id));
    await volunteerRequestToVolunteerRepository.update({ id: In(idsToUpdate) }, { volunteerId: newId });
  },

  async getProgramVolunteersPerInstitution(programId: number, institutionId?: number): Promise<any> {
    const results = await this.query(
      `select u.firstName, u.lastName, u.phone, u.email, u.companyId, count(vrtv.id) vrCount, count(distinct(vr.institutionId)) uniqueInstitution
      from volunteer_request vr
          inner join volunteer_request_to_volunteer vrtv on vr.id = vrtv.volunteerRequestId
          inner join users u on vrtv.volunteerId = u.id
      where vr.programId = ${programId} ${institutionId ? 'and vr.institutionId = ' + institutionId : '\n'} 
      group by u.firstName, u.lastName, u.phone, u.email, u.companyId
    `
    );
    return results;
    //Add to get institution query, number of opened requests and past requests
  }
});
