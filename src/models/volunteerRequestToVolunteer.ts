import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user';
import { VolunteerRequest } from './volunteerRequest';

@Entity()
export class VolunteerRequestToVolunteer {
  @PrimaryColumn()
  volunteerId: string;

  @PrimaryColumn()
  volunteerRequestId: number;

  @ManyToOne(
    () => User,
    user => user.volunteerRequestToVolunteer
  )
  volunteer: User;

  @ManyToOne(
    () => VolunteerRequest,
    volunteerRequest => volunteerRequest.volunteerRequestToVolunteer
  )
  volunteerRequest: VolunteerRequest;
}
