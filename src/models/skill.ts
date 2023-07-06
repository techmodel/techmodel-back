import { Column, Entity, PrimaryGeneratedColumn, OneToMany, Index } from 'typeorm';
import { SkillToVolunteerRequest } from './skillToVolunteerRequest';

@Entity()
@Index('IDX_skill_UQ_name_type', ['name', 'type'], { unique: true })
export class Skill {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_skill' })
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @OneToMany(
    () => SkillToVolunteerRequest,
    skillToVolunteerRequest => skillToVolunteerRequest.skill
  )
  skillToVolunteerRequest!: SkillToVolunteerRequest[];
}
