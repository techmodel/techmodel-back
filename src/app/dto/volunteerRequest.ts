import { Language, RequestStatus, SkillToVolunteerRequest, VolunteerRequest } from '../../models';

export interface CreateVolunteerRequestDTO {
  createdAt: Date;
  name: string;
  audience: number;
  isPhysical: boolean;
  description: string;
  startDate: Date;
  endDate: Date;
  duration: string;
  startTime: Date;
  totalVolunteers: number;
  status: RequestStatus;
  institutionId: number;
  programId: number;
  language: Language;
  skills?: number[];
}

export const volunteerRequestDtoToDomain = (vr: CreateVolunteerRequestDTO): VolunteerRequest => {
  const domainVr = new VolunteerRequest();
  domainVr.createdAt = vr.createdAt;
  domainVr.name = vr.name;
  domainVr.audience = vr.audience;
  domainVr.isPhysical = vr.isPhysical;
  domainVr.description = vr.description;
  domainVr.startDate = vr.startDate;
  domainVr.endDate = vr.endDate;
  domainVr.duration = vr.duration;
  domainVr.startTime = vr.startTime;
  domainVr.totalVolunteers = vr.totalVolunteers;
  domainVr.status = vr.status;
  domainVr.institutionId = vr.institutionId;
  domainVr.language = vr.language;
  domainVr.programId = vr.programId;
  if (vr.skills) {
    const skillsToVr: SkillToVolunteerRequest[] = vr.skills.map(skillId => {
      const skillToVr = new SkillToVolunteerRequest();
      skillToVr.skillId = skillId;
      return skillToVr;
    });
    domainVr.skillToVolunteerRequest = skillsToVr;
  }
  return domainVr;
};
