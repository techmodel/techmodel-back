import { Institution, InstitutionType, PopulationType } from '../../models';

export interface CreateInstitutionDTO {
  name: string;
  address: string;
  locationId: number;
  cityId: number;
  populationType: PopulationType;
  institutionType: InstitutionType;
}

export const mapCreateInstitutionDtoToDomain = (institution: CreateInstitutionDTO): Institution => {
  const domainInstitution = new Institution();
  domainInstitution.name = institution.name;
  domainInstitution.address = institution.address;
  domainInstitution.locationId = institution.locationId;
  domainInstitution.cityId = institution.cityId;
  domainInstitution.populationType = institution.populationType;
  domainInstitution.institutionType = institution.institutionType;
  return domainInstitution;
};
