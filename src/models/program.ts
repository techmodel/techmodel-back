import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProgramToInstitution } from './programToInstitution';
import { User } from './user';
import { VolunteerRequest } from './volunteerRequest';

@Entity()
export class Program {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_program' })
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  programUrl: string;

  @OneToMany(
    () => User,
    user => user.company
  )
  users?: User[];

  @OneToMany(
    () => VolunteerRequest,
    volunteerRequest => volunteerRequest.program
  )
  volunteerRequests?: VolunteerRequest[];

  @OneToMany(
    () => ProgramToInstitution,
    programToInstitution => programToInstitution.program
  )
  programToInstitution?: ProgramToInstitution[];
}
