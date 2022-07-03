import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user';
import { VolunteerRequest } from './volunteerRequest';

@Entity()
@Index(['volunteerId', 'volunteerRequestId'], { unique: true })
export class VolunteerRequestToVolunteer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  volunteerId!: string;

  @Column()
  volunteerRequestId!: number;

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
