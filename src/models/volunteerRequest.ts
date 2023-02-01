import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Language } from './language';
import { RequestStatus } from './volunteerRequestStatus';
import { SkillToVolunteerRequest } from './skillToVolunteerRequest';
import { VolunteerRequestToVolunteer } from './volunteerRequestToVolunteer';
import { Institution } from './institution';
import { Program } from './program';
import { TimeUnit } from './timeUnit';
import { Audience } from './audience';
import { User } from './user';

@Entity()
export class VolunteerRequest {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_volunteer_request' })
  id: number;

  @CreateDateColumn()
  createdAt!: Date;

  @CreateDateColumn()
  updatedAt!: Date;

  @Column()
  name: string;

  @Column()
  audience: Audience;

  @Column()
  isPhysical: boolean;

  @Column()
  description: string;

  @Column({ nullable: true })
  meetingUrl: string;

  @Column({ nullable: true })
  genericUrl: string;

  @Column({ type: 'datetime' })
  startDate: Date;

  @Column({ type: 'datetime' })
  endDate: Date;

  @Column({ nullable: true })
  durationTimeAmount: number;

  @Column({ nullable: true })
  durationTimeUnit: TimeUnit;

  @Column({ nullable: true })
  frequencyTimeAmount: number;

  @Column({ nullable: true })
  frequencyTimeUnit: TimeUnit;

  @Column({ nullable: true })
  dateFlexible: boolean;

  @Column({ type: 'datetime' })
  startTime: Date;

  @Column()
  totalVolunteers: number;

  @Column({ nullable: true })
  currentVolunteers!: number;

  @Column({ type: 'varchar' })
  status: RequestStatus;

  @Column()
  institutionId: number;

  @Column()
  programId: number;

  @Column()
  creatorId: string;

  @ManyToOne(
    () => Institution,
    institution => institution.users
  )
  @JoinColumn({
    foreignKeyConstraintName: 'FK_volunteer_request_institution_id'
  })
  institution: Institution;

  @ManyToOne(
    () => Program,
    program => program.users
  )
  @JoinColumn({
    foreignKeyConstraintName: 'FK_volunteer_request_program_id'
  })
  program: Program;

  @Column({ type: 'varchar' })
  language: Language;

  @OneToMany(
    () => VolunteerRequestToVolunteer,
    volunteerRequestToVolunteer => volunteerRequestToVolunteer.volunteerRequest
  )
  volunteerRequestToVolunteer!: VolunteerRequestToVolunteer[];

  @OneToMany(
    () => SkillToVolunteerRequest,
    skillToVolunteerRequest => skillToVolunteerRequest.volunteerRequest,
    /**
     * cascade is set to `true` so that when we save volunteer requests
     * with their skillToVolunteerRequest, it will be able to create them all together
     * with links between each other (volunteerRequestId on the SkillToVolunteerRequest)
     */
    { cascade: true }
  )
  skillToVolunteerRequest: SkillToVolunteerRequest[];

  @ManyToOne(
    () => User,
    user => user.createdVolunteerRequests
  )
  @JoinColumn({ foreignKeyConstraintName: 'FK_volunteer_request_creator_id' })
  creator: User;
}
