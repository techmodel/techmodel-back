import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { SkillToVolunteerRequest } from './skillToVolunteerRequest';

@Entity()
export class Skill {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt!: Date;

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
