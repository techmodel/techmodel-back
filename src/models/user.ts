import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { Company } from './company';
import { Institution } from './institution';
import { Program } from './program';
import { UserType } from './userType';
import { VolunteerRequest } from './volunteerRequest';
import { VolunteerRequestToVolunteer } from './volunteerRequestToVolunteer';

@Entity({ name: 'users' })
export class User {
  @PrimaryColumn()
  id: string;

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
  institution: Institution;

  @ManyToOne(
    () => Program,
    program => program.users
  )
  program: Program;

  @ManyToOne(
    () => Company,
    company => company.users
  )
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
  createdVolunteerRequests?: VolunteerRequest[];
}
