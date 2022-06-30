import { Institution } from '../models';
import { institutionRepository } from '../repos';

export const getInstitutions = (): Promise<Institution[]> => {
  return institutionRepository.find();
};
