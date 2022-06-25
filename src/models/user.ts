import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Company } from './company';
import { Institution } from './institution';
import { Program } from './program';
import { UserType } from './userType';
import { VolunteerRequest } from './volunteerRequest';
import { VolunteerRequestToVolunteer } from './volunteerRequestToVolunteer';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
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

  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.VOLUNTEER
  })
  userType: UserType;

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
