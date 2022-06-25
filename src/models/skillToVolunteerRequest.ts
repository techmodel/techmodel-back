import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Skill } from './skill';
import { VolunteerRequest } from './volunteerRequest';

@Entity()
export class SkillToVolunteerRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt!: Date;

  @Column()
  skillId: number;

  @Column()
  requestId: number;

  @ManyToOne(
    () => Skill,
    skill => skill.skillToVolunteerRequest
  )
  skill: Skill;

  @ManyToOne(
    () => VolunteerRequest,
    volunteerRequest => volunteerRequest.skillToVolunteerRequest
  )
  volunteerRequest: VolunteerRequest;
}
