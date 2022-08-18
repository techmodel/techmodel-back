import logger from '../logger';
import { PendingProgramCoordinator, Program, User, UserType } from '../models';
import { pendingProgramCoordinatorRepository, programRepository, userRepository } from '../repos';

export const getPrograms = (): Promise<Program[]> => {
  return programRepository.find();
};

export const getCoordinators = (programId: number): Promise<User[]> => {
  return userRepository.find({ where: { programId, userType: UserType.PROGRAM_COORDINATOR } });
};

export const getPendingCoordinators = async (programId: number): Promise<PendingProgramCoordinator[]> => {
  return await pendingProgramCoordinatorRepository.find({
    where: { programId },
    relations: ['user', 'institution']
  });
};
