import { Program } from '../../models';

export interface ReturnVRProgramDTO {
  id: number;
  name: string;
  description: string;
  programUrl: string;
}

export interface ReturnProgramDTO {
  id: number;
  name: string;
  description: string;
  institutionIds: number[];
  programUrl: string;
  canBeManaged: boolean;
}

export const mapPrgoramToProgramDTO = (program: Program, canBeManaged: boolean): ReturnProgramDTO => {
  let relatedInstitutions: number[] = [];
  if (program.programToInstitution) {
    relatedInstitutions = program.programToInstitution.map(mapping => mapping.institutionId);
  }
  return {
    id: program.id,
    name: program.name,
    description: program.description,
    institutionIds: relatedInstitutions,
    programUrl: program.programUrl,
    canBeManaged
  };
};
