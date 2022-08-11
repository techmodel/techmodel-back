import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Institution } from './institution';
import { Program } from './program';
import { User } from './user';

@Entity()
export class PendingProgramCoordinator {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_pending_program_coordinator' })
  id: number;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt!: Date;

  @Column()
  programId: number;

  @Column()
  institutionId: number;

  @ManyToOne(
    () => Program,
    program => program.users
  )
  @JoinColumn({
    foreignKeyConstraintName: 'FK_pending_program_coordinator_program_id'
  })
  program!: Program;

  @ManyToOne(
    () => Institution,
    institution => institution.users
  )
  @JoinColumn({
    foreignKeyConstraintName: 'FK_pending_program_coordinator_institution_id'
  })
  institution: Institution;

  @OneToOne(() => User)
  @JoinColumn({
    foreignKeyConstraintName: 'FK_pending_program_coordinator_user_id'
  })
  user!: User;
}
