import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { User } from './user';

@Entity()
export class Feedback {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_feedback' })
  id: number;

  @CreateDateColumn()
  createdAt!: Date;

  @Column()
  userId?: string;

  @Column()
  volunteerRequestId?: number;

  @Column()
  review?: number;

  @Column()
  notes: string;

  @ManyToOne(
    () => User,
    user => user.feedback,
    { createForeignKeyConstraints: false } // disable to be able to delete users
  )
  user?: User;
}
