import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
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

  @Column({ nullable: true })
  institutionId!: number;

  @Column({ nullable: true })
  programId!: number;

  @Column({ nullable: true })
  companyId!: number;

  @OneToOne(() => Institution)
  @JoinColumn()
  institution: Institution;

  @OneToOne(() => Program)
  @JoinColumn()
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
