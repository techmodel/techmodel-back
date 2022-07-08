import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { User } from './user';

@Entity()
export class Program {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @OneToMany(
    () => User,
    user => user.company
  )
  users?: User[];
}
