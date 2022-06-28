import { LessThan } from 'typeorm';
import { appDataSource } from '../dataSource';
import { VolunteerRequest } from '../models';

export const volunteerRequestRepository = appDataSource.getRepository(VolunteerRequest).extend({
  // async relevantAndOpen(): Promise<VolunteerRequest[]> {
  //   const results = await this.createQueryBuilder('vr')
  //     .loadRelationCountAndMap('vr.currentVolunteers', 'user.volunteerRequestToVolunteer')
  //     .leftJoinAndSelect('vr.')
  //     .getMany();
  //   this.find({ loadEagerRelations });
  //   return results.filter(vr => vr.current_volunteers < vr.total_volunteers);
  // }
});

// type volunteerRequestMainPage = {
//   id: number;
//   createdAt: Date;
//   name: string;
//   audience: number;
//   isPhysical: boolean;
//   description: string;
//   startDate: Date;
//   endDate: Date;
//   duration: string;
//   startTime: Date;
//   status: RequestStatus;
//   language: Language;
//   totalVolunteers: string;
//   currentVolunteers: number;
// };

// return this.createQueryBuilder('vr')
//       .leftJoinAndSelect('user.linkedSheep', 'linkedSheep')
//       .leftJoinAndSelect('user.linkedCow', 'linkedCow')
//       .where('vr.end_date')
//       .andWhere('user.linkedCow = :cowId', { cowId })
//       .getMany();
