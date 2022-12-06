import {
  Language,
  RequestStatus,
  SkillToVolunteerRequest,
  VolunteerRequest,
  TimeUnit,
  Audience,
  User
} from '../../models';
import { ReturnCreatorDTO } from './creator';
import { ReturnVRProgramDTO } from './program';
import { ReturnSkillDTO } from './skill';
import { ReturnVolunteerDTO } from './volunteer';

export interface CreateVolunteerRequestDTO {
  name: string;
  audience: Audience;
  isPhysical: boolean;
  description: string;
  startDate: Date;
  endDate: Date;
  durationTimeAmount: number;
  durationTimeUnit: TimeUnit;
  frequencyTimeAmount: number;
  frequencyTimeUnit: TimeUnit;
  startTime: Date;
  totalVolunteers: number;
  institutionId: number;
  programId: number;
  language: Language;
  skills?: number[];
  creatorId: string;
}

export type UpdateVolunteerRequestDTO = Partial<CreateVolunteerRequestDTO>;

export const mapCreateVolunteerRequestDtoToDomain = (vr: CreateVolunteerRequestDTO): VolunteerRequest => {
  const domainVr = new VolunteerRequest();
  domainVr.name = vr.name;
  domainVr.audience = vr.audience;
  domainVr.isPhysical = vr.isPhysical;
  domainVr.description = vr.description;
  domainVr.startDate = new Date(vr.startDate);
  domainVr.endDate = new Date(vr.endDate);
  domainVr.durationTimeAmount = vr.durationTimeAmount;
  domainVr.durationTimeUnit = vr.durationTimeUnit;
  domainVr.frequencyTimeAmount = vr.frequencyTimeAmount;
  domainVr.frequencyTimeUnit = vr.frequencyTimeUnit;
  domainVr.startTime = new Date(vr.startTime);
  domainVr.totalVolunteers = vr.totalVolunteers;
  domainVr.institutionId = vr.institutionId;
  domainVr.language = vr.language;
  domainVr.programId = vr.programId;
  domainVr.creatorId = vr.creatorId;
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

export const mapUpdateVolunteerRequestDtoToDomain = (vr: UpdateVolunteerRequestDTO): VolunteerRequest => {
  return mapCreateVolunteerRequestDtoToDomain(vr as CreateVolunteerRequestDTO);
};

export interface ReturnVolunteerRequestDTO {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  audience: Audience;
  isPhysical: boolean;
  description: string;
  startDate: string;
  endDate: string;
  durationTimeAmount: number;
  durationTimeUnit: TimeUnit;
  frequencyTimeAmount: number;
  frequencyTimeUnit: TimeUnit;
  startTime: string;
  totalVolunteers: number;
  currentVolunteers: number;
  status: RequestStatus;
  institutionId: number;
  program: ReturnVRProgramDTO;
  language: Language;
  creatorId: string;
  creator?: ReturnCreatorDTO;
  skills?: ReturnSkillDTO[];
  volunteers?: ReturnVolunteerDTO[];
}

export const mapVolunteerRequestToReturnVolunteerRequestDTO = (vr: VolunteerRequest): ReturnVolunteerRequestDTO => {
  const returnVolunteerRequestDTO: ReturnVolunteerRequestDTO = {
    id: vr.id,
    createdAt: vr.createdAt.toISOString(),
    updatedAt: vr.updatedAt?.toISOString(),
    name: vr.name,
    audience: vr.audience,
    isPhysical: vr.isPhysical,
    description: vr.description,
    startDate: vr.startDate.toISOString(),
    endDate: vr.endDate.toISOString(),
    durationTimeAmount: vr.durationTimeAmount,
    durationTimeUnit: vr.durationTimeUnit,
    frequencyTimeAmount: vr.frequencyTimeAmount,
    frequencyTimeUnit: vr.frequencyTimeUnit,
    startTime: vr.startTime.toISOString(),
    totalVolunteers: vr.totalVolunteers,
    currentVolunteers: vr.currentVolunteers,
    status: vr.status,
    institutionId: vr.institutionId,
    program: {
      id: vr.program.id,
      name: vr.program.name,
      description: vr.program.description
    },
    language: vr.language,
    creatorId: vr.creatorId,
    creator: {
      id: vr.creator.id,
      email: vr.creator.email,
      phone: vr.creator.phone,
      firstName: vr.creator.firstName,
      lastName: vr.creator.lastName,
      userType: vr.creator.userType,
      programId: vr.creator.programId!,
      institutionId: vr.creator.institutionId
    }
  };
  if (vr.skillToVolunteerRequest && vr.skillToVolunteerRequest.length > 0) {
    returnVolunteerRequestDTO.skills = vr.skillToVolunteerRequest.map(skillToRequest => ({
      id: skillToRequest.skill.id,
      name: skillToRequest.skill.name,
      type: skillToRequest.skill.type
    }));
  }
  if (vr.volunteerRequestToVolunteer && vr.volunteerRequestToVolunteer.length > 0) {
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
