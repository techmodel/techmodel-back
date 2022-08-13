import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Language } from './language';
import { RequestStatus } from './volunteerRequestStatus';
import { SkillToVolunteerRequest } from './skillToVolunteerRequest';
import { VolunteerRequestToVolunteer } from './volunteerRequestToVolunteer';
import { Institution } from './institution';
import { Program } from './program';

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
  totalVolunteers: number;

  @Column({ nullable: true })
  currentVolunteers!: number;

  @Column({ type: 'varchar' })
  status: RequestStatus;

  @Column()
  institutionId: number;

  @Column()
  programId: number;

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
    skillToVolunteerRequest => skillToVolunteerRequest.volunteerRequest
  )
  skillToVolunteerRequest: SkillToVolunteerRequest[];
}
