import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

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
}
