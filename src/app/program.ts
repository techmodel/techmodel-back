import { appDataSource } from '../dataSource';
import { CannotPerformOperationError, NotFoundError } from '../exc';
import logger from '../logger';
import { PendingProgramCoordinator, Program, User, UserType } from '../models';
import {
  pendingProgramCoordinatorRepository,
  programRepository,
  programToInstitutionRepository,
  userRepository
} from '../repos';
import { mapPrgoramToProgramDTO, ReturnProgramDTO } from './dto/program';
import { userDecoded } from './user';

export const getPrograms = async (): Promise<ReturnProgramDTO[]> => {
  const programs = await programRepository.find({ relations: ['programToInstitution'] });
  return programs.map(program => mapPrgoramToProgramDTO(program));
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

export const denyPendingCoordinator = async (programId: number, pendingUserId: string): Promise<void> => {
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
  await appDataSource.manager.transaction(async transactionalEntityManager => {
    await transactionalEntityManager.delete(PendingProgramCoordinator, targetPendingCoordinator.id);
    await transactionalEntityManager.delete(User, pendingUserId);
  });
};

export const programRelatedInstitutions = async (programId: number): Promise<number[]> => {
  const res = await programToInstitutionRepository.find({ where: { programId } });
  return res.map(mapping => mapping.institutionId);
};

export const addInstitutionToProgram = async (programId: number, institutionId: number): Promise<void> => {
  await programToInstitutionRepository.save({ programId, institutionId });
};

export const deleteInstitutionToProgram = async (programId: number, institutionId: number): Promise<void> => {
  await programToInstitutionRepository.delete({ programId, institutionId });
};
