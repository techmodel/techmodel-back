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

  @Column({ type: 'datetime' })
  startDate: Date;

  @Column({ type: 'datetime' })
  endDate: Date;

  @Column()
  duration: string; // TODO: decide on the type of the column

  @Column({ type: 'datetime' })
  startTime: Date;

  @Column()
  volunteerAmount: string; // TODO: think about a better name, maybe attendees? participants?

  @Column({ type: 'varchar' })
  status: RequestStatus;

  @Column({ nullable: true })
  creatorId!: number;

  @OneToOne(() => User)
  @JoinColumn()
  creator: User;

  @Column({ type: 'varchar' })
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
