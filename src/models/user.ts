import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { Company } from './company';
import { Institution } from './institution';
import { Program } from './program';
import { UserType } from './userType';
import { VolunteerRequestToVolunteer } from './volunteerRequestToVolunteer';

@Entity({ name: 'users' })
export class User {
  @PrimaryColumn()
  id: number;

  @CreateDateColumn()
  createdAt!: Date;

  @Column()
  email: string;

  @Column()
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

  @OneToOne(() => Company)
  @JoinColumn()
  company: Company;

  @OneToMany(
    () => VolunteerRequestToVolunteer,
    volunteerRequestToVolunteer => volunteerRequestToVolunteer.volunteer
  )
  volunteerRequestToVolunteer!: VolunteerRequestToVolunteer[];
}
