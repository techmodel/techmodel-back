import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Skill } from './skill';
import { VolunteerRequest } from './volunteerRequest';

@Entity()
@Index('IDX_skill_to_volunteer_request_UQ_skillid_volunteerrequestid', ['skillId', 'volunteerRequestId'], {
  unique: true
})
export class SkillToVolunteerRequest {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_skill_to_volunteer_request' })
  id: number;

  @Column()
  skillId?: number;

  @Column()
  volunteerRequestId?: number;

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
