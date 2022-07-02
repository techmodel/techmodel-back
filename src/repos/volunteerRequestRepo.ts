import { appDataSource } from '../dataSource';
import { VolunteerRequest, VolunteerRequestToVolunteer } from '../models';

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

  async assignVolunteerToRequest(requestId: number, volunteerId: string): Promise<void> {
    await appDataSource
      .getRepository(VolunteerRequestToVolunteer)
      .insert({ volunteerId, volunteerRequestId: requestId });
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
  }
});
