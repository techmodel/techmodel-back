import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { Company } from './company';
import { Institution } from './institution';
import { Program } from './program';
import { UserType } from './userType';
import { VolunteerRequest } from './volunteerRequest';
import { VolunteerRequestToVolunteer } from './volunteerRequestToVolunteer';
import { Feedback } from './feedback';

@Entity({ name: 'users' })
export class User {
  @PrimaryColumn({ primaryKeyConstraintName: 'PK_users' })
  id: string;

  @Column({ nullable: true, unique: false })
  oldId: string; // populated only if the user has been deleted

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phone: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'varchar' })
  userType: UserType;

  @Column({ nullable: true, unique: false })
  institutionId?: number | null;

  @Column({ nullable: true, unique: false })
  programId?: number | null;

  @Column({ nullable: true })
  companyId?: number | null;

  @ManyToOne(
    () => Institution,
    institution => institution.users
  )
  @JoinColumn({
    foreignKeyConstraintName: 'FK_users_institution_id'
  })
  institution: Institution;

  @ManyToOne(
    () => Program,
    program => program.users
  )
  @JoinColumn({
    foreignKeyConstraintName: 'FK_users_program_id'
  })
  program: Program;

  @ManyToOne(
    () => Company,
    company => company.users
  )
  @JoinColumn({
    foreignKeyConstraintName: 'FK_users_company_id'
  })
  company: Company;

  @OneToMany(
    () => VolunteerRequestToVolunteer,
    volunteerRequestToVolunteer => volunteerRequestToVolunteer.volunteer
  )
  volunteerRequestToVolunteer?: VolunteerRequestToVolunteer[];

  @OneToMany(
    () => VolunteerRequest,
    volunteerRequest => volunteerRequest.creator
  )
  createdVolunteerRequests: VolunteerRequest[];

  @OneToMany(
    () => Feedback,
    feedback => feedback.userId
  )
  feedback: Feedback[];
}
