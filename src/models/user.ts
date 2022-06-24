import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { UserType } from './userType';

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
  userType: string;

  // TODO: add foreign key
  @Column()
  institution: string;

  // TODO: add foreign key
  @Column()
  program: string;

  // TODO: add foreign key
  @Column()
  company: string;
}
