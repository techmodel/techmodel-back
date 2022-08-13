import { Program, User, UserType } from '../models';
import { programRepository, userRepository } from '../repos';

export const getPrograms = (): Promise<Program[]> => {
  return programRepository.find();
};

export const getCoordinators = (programId: number): Promise<User[]> => {
  return userRepository.find({ where: { programId, userType: UserType.PROGRAM_COORDINATOR } });
};
