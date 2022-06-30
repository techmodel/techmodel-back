import { LessThan } from 'typeorm';
import { appDataSource } from '../dataSource';
import { VolunteerRequest } from '../models';

export const volunteerRequestRepository = appDataSource.getRepository(VolunteerRequest).extend({
  async relevantAndOpen(): Promise<VolunteerRequest[]> {
    return await volunteerRequestRepository
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
  }
});
