import { appDataSource } from '../dataSource';
import { NotFoundError } from '../exc';
import { RequestStatus, VolunteerRequest, VolunteerRequestToVolunteer } from '../models';

export const volunteerRequestRepository = appDataSource.getRepository(VolunteerRequest).extend({
  async relevantAndOpen(): Promise<VolunteerRequest[]> {
    return await this
      // alias to VolunteerRequest
      .createQueryBuilder('vr')
      // populate vr.currentVolunteers
      .loadRelationCountAndMap('vr.currentVolunteers', 'vr.volunteerRequestToVolunteer')
      .leftJoinAndSelect('vr.skillToVolunteerRequest', 'stvr')
      .leftJoinAndSelect('stvr.skill', 'skill')
      .andWhere('vr.startDate > :currentDate', { currentDate: new Date().toISOString() })
      // filter out requests that are full
      .andWhere(qb => {
        const subQuery = qb
          .subQuery()
          .select('vr.id')
          .from(VolunteerRequest, 'vr')
          .leftJoin('vr.volunteerRequestToVolunteer', 'vrtv')
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
      .leftJoinAndSelect('stvr.skill', 'skill')
      .leftJoinAndSelect(`vr.creator`, `creator`)
      .andWhere('vr.startDate > :startDate', { startDate })
      .andWhere(`creator.programId = :programId`, { programId });
    if (institutionId) {
      qb = qb.andWhere(`creator.institutionId = :institutionId`, { institutionId });
    }
    return qb.getMany();
  },

  async assignVolunteerToRequest(requestId: number, volunteerId: string): Promise<void> {
    await appDataSource
      .getRepository(VolunteerRequestToVolunteer)
      .insert({ volunteerId, volunteerRequestId: requestId });
    // TODO: handle concurrent inserts (it should be inside the transaction)
  },

  async volunteerRequestsByVolunteerId(volunteerId: string): Promise<VolunteerRequest[]> {
    return await this
      // alias to VolunteerRequest
      .createQueryBuilder('vr')
      // populate vr.currentVolunteers
      .loadRelationCountAndMap('vr.currentVolunteers', 'vr.volunteerRequestToVolunteer')
      .leftJoinAndSelect('vr.skillToVolunteerRequest', 'stvr')
      .leftJoinAndSelect('stvr.skill', 'skill')
      .leftJoin('vr.volunteerRequestToVolunteer', 'vrtv')
      .andWhere('vrtv.volunteerId = :volunteerId', { volunteerId })
      .getMany();
  },

  async requestById(id: number): Promise<VolunteerRequest | null> {
    return await this.findOne({ where: { id }, relations: ['creator', 'volunteerRequestToVolunteer'] });
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
