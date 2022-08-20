import { appDataSource } from '../dataSource';
import { CannotPerformOperationError, NotFoundError } from '../exc';
import logger from '../logger';
import { PendingProgramCoordinator, Program, User, UserType } from '../models';
import { pendingProgramCoordinatorRepository, programRepository, userRepository } from '../repos';
import { userDecoded } from './user';

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

export const acceptPendingCoordinator = async (programId: number, pendingUserId: string): Promise<void> => {
  const targetPendingCoordinator = await pendingProgramCoordinatorRepository.findOne({
    where: { userId: pendingUserId },
    relations: ['user']
  });
  const targetUser = targetPendingCoordinator?.user;
  if (!targetUser) {
    throw new NotFoundError('Target user not found');
  }
  if (targetPendingCoordinator.programId !== programId) {
    throw new CannotPerformOperationError('Target user is not from the same program');
  }
  targetUser.userType = UserType.PROGRAM_COORDINATOR;
  targetUser.institutionId = targetPendingCoordinator.institutionId;
  targetUser.programId = targetPendingCoordinator.programId;
  await appDataSource.manager.transaction(async transactionalEntityManager => {
    await transactionalEntityManager.save(targetUser);
    await transactionalEntityManager.remove(targetPendingCoordinator);
  });
};
