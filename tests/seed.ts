import { appDataSource } from '../src/dataSource';
import {
  City,
  Company,
  Institution,
  Location,
  Program,
  Skill,
  SkillToVolunteerRequest,
  User,
  VolunteerRequest,
  VolunteerRequestToVolunteer
} from '../src/models';
import {
  cityRepository,
  companyRepository,
  institutionRepository,
  locationRepository,
  programRepository,
  skillRepository,
  userRepository,
  volunteerRequestRepository
} from '../src/repos';

type seedOptions = {
  cities?: City[];
  locations?: Location[];
  institutions?: Institution[];
  programs?: Program[];
  companies?: Company[];
  users?: User[];
  volunteerRequests?: VolunteerRequest[];
  volunteerRequestToVolunteers?: VolunteerRequestToVolunteer[];
  skills?: Skill[];
  skillToVolunteerRequests?: SkillToVolunteerRequest[];
};

export const volunteerRequestToVolunteerRepository = appDataSource.getRepository(VolunteerRequestToVolunteer);
export const SkillToVolunteerRequestRepository = appDataSource.getRepository(SkillToVolunteerRequest);

export const seed = async (options: seedOptions): Promise<void> => {
  if (options.cities) {
    for (const city of options.cities) {
      await cityRepository.save(city);
    }
  }
  if (options.locations) {
    for (const location of options.locations) {
      await locationRepository.save(location);
    }
  }
  if (options.institutions) {
    for (const institution of options.institutions) {
      await institutionRepository.save(institution);
    }
  }
  if (options.programs) {
    for (const program of options.programs) {
      await programRepository.save(program);
    }
  }
  if (options.companies) {
    for (const companie of options.companies) {
      await companyRepository.save(companie);
    }
  }
  if (options.users) {
    for (const user of options.users) {
      await userRepository.save(user);
    }
  }
  if (options.volunteerRequests) {
    for (const volunteerRequest of options.volunteerRequests) {
      await volunteerRequestRepository.save(volunteerRequest);
    }
  }
  if (options.volunteerRequestToVolunteers) {
    for (const volunteerRequestToVolunteer of options.volunteerRequestToVolunteers) {
      await volunteerRequestToVolunteerRepository.save(volunteerRequestToVolunteer);
    }
  }
  if (options.skills) {
    for (const skill of options.skills) {
      await skillRepository.save(skill);
    }
  }
  if (options.skillToVolunteerRequests) {
    for (const skillToVolunteerRequest of options.skillToVolunteerRequests) {
      await SkillToVolunteerRequestRepository.save(skillToVolunteerRequest);
    }
  }
};

export const removeSeed = async (): Promise<void> => {
  await SkillToVolunteerRequestRepository.delete({});
  await skillRepository.delete({});
  await volunteerRequestToVolunteerRepository.delete({});
  await volunteerRequestRepository.delete({});
  await userRepository.delete({});
  await companyRepository.delete({});
  await programRepository.delete({});
  await institutionRepository.delete({});
  await locationRepository.delete({});
  await cityRepository.delete({});
};
