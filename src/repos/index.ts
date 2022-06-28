import { appDataSource } from '../dataSource';
import { Company } from '../models';

export { userRepository } from './userRepo';
export const companyRepository = appDataSource.getRepository(Company);
