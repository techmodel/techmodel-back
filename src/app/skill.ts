import { Skill } from '../models';
import { skillRepository } from '../repos';

export const getSkills = (): Promise<Skill[]> => {
  return skillRepository.find();
};
