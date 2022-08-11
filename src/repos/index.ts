import { appDataSource } from '../dataSource';
import {
  City,
  Company,
  Institution,
  Location,
  PendingProgramCoordinator,
  PendingProgramManager,
  Program,
  Skill
} from '../models';

export { userRepository } from './userRepo';
export { volunteerRequestRepository } from './volunteerRequestRepo';
export const companyRepository = appDataSource.getRepository(Company);
export const cityRepository = appDataSource.getRepository(City);
export const locationRepository = appDataSource.getRepository(Location);
export const institutionRepository = appDataSource.getRepository(Institution);
export const programRepository = appDataSource.getRepository(Program);
export const skillRepository = appDataSource.getRepository(Skill);
export const pendingProgramCoordinatorRepository = appDataSource.getRepository(PendingProgramCoordinator);
export const pendingProgramManagerRepository = appDataSource.getRepository(PendingProgramManager);
