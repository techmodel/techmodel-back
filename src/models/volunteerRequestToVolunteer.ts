import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user';
import { VolunteerRequest } from './volunteerRequest';

@Entity()
export class VolunteerRequestToVolunteer {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt!: Date;

  @Column()
  volunteerId: number;

  @Column()
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
