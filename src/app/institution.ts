import { Institution } from '../models';
import { institutionRepository } from '../repos';
import { CreateInstitutionDTO, mapCreateInstitutionDtoToDomain } from './dto/institution';
import { createInstitutionSchema, validateSchema } from './schema.validators';

export const getInstitutions = (): Promise<Institution[]> => {
  return institutionRepository.find();
};

export const createInstitution = async (newInstitutionDto: CreateInstitutionDTO): Promise<void> => {
  const validatedInstitutionDTO = validateSchema(createInstitutionSchema, newInstitutionDto);
  const domainInstitution = mapCreateInstitutionDtoToDomain(validatedInstitutionDTO);
  domainInstitution.createdAt = new Date();
  await institutionRepository.save(domainInstitution);
};
