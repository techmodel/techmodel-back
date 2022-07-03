import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, Index } from 'typeorm';
import { SkillToVolunteerRequest } from './skillToVolunteerRequest';

@Entity()
@Index(['name', 'type'], { unique: true })
export class Skill {
  @PrimaryGeneratedColumn()
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
