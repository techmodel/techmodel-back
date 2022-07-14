import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user';
import { VolunteerRequest } from './volunteerRequest';

@Entity()
@Index('IDX_volunteer_request_to_volunteer_UQ_volunteerid_volunteerrequestid', ['volunteerId', 'volunteerRequestId'], {
  unique: true
})
export class VolunteerRequestToVolunteer {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_volunteer_request_to_volunteer' })
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
