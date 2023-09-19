import { appDataSource } from '../dataSource';
import {
  City,
  Company,
  Institution,
  Location,
  PendingProgramCoordinator,
  PendingProgramManager,
  Skill,
  User,
  ProgramToInstitution,
  SkillToVolunteerRequest,
  Feedback
} from '../models';

export enum DuplicateErrorNumbers {
  indexConstraint = 2601,
  uniqueConstraint = 2627
}

export { volunteerRequestRepository } from './volunteerRequestRepo';
export { programRepository } from './programRepo';
export const userRepository = appDataSource.getRepository(User);
export const companyRepository = appDataSource.getRepository(Company);
export const cityRepository = appDataSource.getRepository(City);
export const locationRepository = appDataSource.getRepository(Location);
export const institutionRepository = appDataSource.getRepository(Institution);
export const skillRepository = appDataSource.getRepository(Skill);
export const skillToVolunteerRequestRepository = appDataSource.getRepository(SkillToVolunteerRequest);
export const pendingProgramCoordinatorRepository = appDataSource.getRepository(PendingProgramCoordinator);
export const pendingProgramManagerRepository = appDataSource.getRepository(PendingProgramManager);
export const programToInstitutionRepository = appDataSource.getRepository(ProgramToInstitution);
export const feedbackRepository = appDataSource.getRepository(Feedback);
