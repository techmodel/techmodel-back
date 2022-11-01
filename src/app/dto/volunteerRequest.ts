import { Language, RequestStatus, SkillToVolunteerRequest, VolunteerRequest } from '../../models';
import { ReturnSkillDTO } from './skill';
import { ReturnVolunteerDTO } from './volunteer';

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

export const mapCreateVolunteerRequestDtoToDomain = (vr: CreateVolunteerRequestDTO): VolunteerRequest => {
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

export interface ReturnVolunteerRequestDTO {
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
  skills?: ReturnSkillDTO[];
  volunteers?: ReturnVolunteerDTO[];
}

export const mapVolunteerRequestToReturnVolunteerRequestDTO = (vr: VolunteerRequest): ReturnVolunteerRequestDTO => {
  const returnVolunteerRequestDTO: ReturnVolunteerRequestDTO = {
    createdAt: vr.createdAt,
    name: vr.name,
    audience: vr.audience,
    isPhysical: vr.isPhysical,
    description: vr.description,
    startDate: vr.startDate,
    endDate: vr.endDate,
    duration: vr.duration,
    startTime: vr.startTime,
    totalVolunteers: vr.totalVolunteers,
    status: vr.status,
    institutionId: vr.institutionId,
    programId: vr.programId,
    language: vr.language
  };
  if (vr.skillToVolunteerRequest) {
    returnVolunteerRequestDTO.skills = vr.skillToVolunteerRequest.map(skillToRequest => ({
      id: skillToRequest.skill.id,
      name: skillToRequest.skill.name,
      type: skillToRequest.skill.type
    }));
  }
  if (vr.volunteerRequestToVolunteer) {
    returnVolunteerRequestDTO.volunteers = vr.volunteerRequestToVolunteer.map(requestToVolunteer => ({
      id: requestToVolunteer.volunteer.id,
      email: requestToVolunteer.volunteer.email,
      phone: requestToVolunteer.volunteer.phone,
      firstName: requestToVolunteer.volunteer.firstName,
      lastName: requestToVolunteer.volunteer.lastName,
      userType: requestToVolunteer.volunteer.userType,
      companyName: requestToVolunteer.volunteer.company.name
    }));
  }
  return returnVolunteerRequestDTO;
};
