import { Company } from '../models';
import { companyRepository } from '../repos';

export const getCompanies = (): Promise<Company[]> => {
  return companyRepository.find();
};
