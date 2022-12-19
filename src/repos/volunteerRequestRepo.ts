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
      .leftJoinAndSelect('vr.program', 'program')
      .leftJoinAndSelect('vr.creator', 'creator')
      .leftJoinAndSelect('stvr.skill', 'skill')
      .andWhere('vr.startDate > :currentDate', { currentDate: new Date().toISOString() })
      .andWhere(`vr.status = :status`, { status: 'sent' })
      // filter out requests that are full
      .andWhere(qb => {
        const subQuery = qb
          .subQuery()
          .select('vr.id')
          .from(VolunteerRequest, 'vr')
          .leftJoin('vr.volunteerRequestToVolunteer', 'vrtv')
          .where(`vrtv.volunteerId != '${volunteerId}'`)
          .orWhere('vrtv.volunteerId is null')
          .groupBy('vr.id, vr.totalVolunteers')
          .having('COUNT(*) < vr.totalVolunteers')
          .getQuery();
        return 'vr.id IN ' + subQuery;
      })
      .getMany();
  },

  async requestsOfProgram(
    programId: number,
    institutionId?: number,
    startDate = new Date().toISOString()
  ): Promise<VolunteerRequest[]> {
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
      .andWhere('vr.startDate > :startDate', { startDate })
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
  }
});
