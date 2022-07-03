import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Skill } from './skill';
import { VolunteerRequest } from './volunteerRequest';

@Entity()
@Index(['skillId', 'volunteerRequestId'], { unique: true })
export class SkillToVolunteerRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  skillId!: number;

  @Column()
  volunteerRequestId!: number;

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
