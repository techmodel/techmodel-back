import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user';

@Entity()
export class Company {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_company' })
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  companyUrl: string;

  @OneToMany(
    () => User,
    user => user.company
  )
  users?: User[];
}
