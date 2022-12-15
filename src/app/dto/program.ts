import { Program } from '../../models';

export interface ReturnVRProgramDTO {
  id: number;
  name: string;
  description: string;
}

export interface ReturnProgramDTO {
  id: number;
  name: string;
  description: string;
  institutionIds: number[];
}

export const mapPrgoramToProgramDTO = (program: Program): ReturnProgramDTO => {
  let relatedInstitutions: number[] = [];
  if (program.programToInstitution) {
    relatedInstitutions = program.programToInstitution.map(mapping => mapping.institutionId);
  }
  return {
    id: program.id,
    name: program.name,
    description: program.description,
    institutionIds: relatedInstitutions
  };
};
