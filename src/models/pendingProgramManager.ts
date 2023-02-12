import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Program } from './program';
import { User } from './user';

@Entity()
export class PendingProgramManager {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_pending_program_manager' })
  id: number;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt!: Date;

  @Column()
  programId: number;

  @ManyToOne(
    () => Program,
    program => program.users
  )
  @JoinColumn({
    foreignKeyConstraintName: 'FK_pending_program_manager_program_id'
  })
  program!: Program;

  @OneToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn()
  user!: User;
}
