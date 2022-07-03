import { Program } from '../models';
import { programRepository } from '../repos';

export const getPrograms = (): Promise<Program[]> => {
  return programRepository.find();
};
