import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Skill } from './skill';
import { VolunteerRequest } from './volunteerRequest';

@Entity()
export class SkillToVolunteerRequest {
  @PrimaryColumn()
  skillId!: number;

  @PrimaryColumn()
  requestId!: number;

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
