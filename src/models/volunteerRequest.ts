import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Language } from './language';
import { RequestStatus } from './volunteerRequestStatus';
import { SkillToVolunteerRequest } from './skillToVolunteerRequest';
import { User } from './user';
import { VolunteerRequestToVolunteer } from './volunteerRequestToVolunteer';

@Entity()
export class VolunteerRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt!: Date;

  @Column()
  name: string;

  @Column()
  audience: number;

  @Column()
  isPhysical: boolean;

  @Column()
  description: string;

  @Column({ type: 'timestamptz' })
  startDate: Date;

  @Column({ type: 'timestamptz' })
  endDate: Date;

  @Column()
  duration: string; // TODO: decide on the type of the column

  @Column({ type: 'timestamptz' })
  startTime: Date;

  @Column()
  volunteerAmount: string; // TODO: think about a better name, maybe attendees? participants?

  @Column({
    type: 'enum',
    enum: RequestStatus,
    default: RequestStatus.SENT
  })
  status: RequestStatus;

  @OneToOne(() => User)
  @JoinColumn()
  creator: User;

  @Column({
    type: 'enum',
    enum: Language,
    default: Language.HEBREW
  })
  language: Language;

  @OneToMany(
    () => VolunteerRequestToVolunteer,
    volunteerRequestToVolunteer => volunteerRequestToVolunteer.volunteerRequest
  )
  volunteerRequestToVolunteer!: VolunteerRequestToVolunteer[];

  @OneToMany(
    () => SkillToVolunteerRequest,
    skillToVolunteerRequest => skillToVolunteerRequest.volunteerRequest
  )
  skillToVolunteerRequest: SkillToVolunteerRequest[];
}
