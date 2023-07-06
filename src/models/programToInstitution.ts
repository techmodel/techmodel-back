import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne, Index } from 'typeorm';
import { Institution } from './institution';
import { Program } from './program';

@Entity()
@Index('IDX_program_to_institution_UQ_institutionid_programid', ['institutionId', 'programId'], {
  unique: true
})
export class ProgramToInstitution {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_program_to_institution' })
  id: number;

  @Column()
  institutionId: number;

  @Column()
  programId: number;

  @ManyToOne(
    () => Institution,
    institution => institution.programToInstitution
  )
  @JoinColumn({
    foreignKeyConstraintName: 'FK_program_to_institution_institution_id'
  })
  institution: Institution;

  @ManyToOne(
    () => Program,
    program => program.programToInstitution
  )
  @JoinColumn({
    foreignKeyConstraintName: 'FK_program_to_institution_program_id'
  })
  program: Program;
}
