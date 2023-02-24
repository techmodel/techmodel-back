import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { QueryFailedError, UpdateResult } from 'typeorm';
import { JWT_SECRET } from '../config';
import { appDataSource } from '../dataSource';
import { AuthorizationError, CannotPerformOperationError, DuplicateValueError, NotFoundError } from '../exc';
import { PendingProgramCoordinator, User, UserType } from '../models';
import { DuplicateErrorNumbers, userRepository, volunteerRequestRepository } from '../repos';
import { createUserSchema, selfUpdateUserSchema, validateSchema } from './schema.validators';

type loginResponse = {
  userDetails: User | null;
  isFound: boolean;
  userToken: string;
  userType: UserType | null;
  userImage: string | null;
  userIdToken: string;
};

export type userDecoded = {
  userId: string;
  userType: UserType;
  institutionId?: number;
  programId?: number;
  companyId?: number;
  iat: number;
  exp: number;
};

export const login = async (userId: string, userImage: string, userIdToken: string): Promise<loginResponse> => {
  const user = await userRepository.findOneBy({ id: userId });
  if (!userId || !user) {
    return { userDetails: null, isFound: false, userToken: '', userType: null, userImage, userIdToken };
  }
  const tokenData: Partial<userDecoded> = {
    userType: user.userType,
    userId,
    // institutionId, programId and companyId might be null when returned from the database
    institutionId: user.institutionId || undefined,
    programId: user.programId || undefined,
    companyId: user.companyId || undefined
  };
  const token = jwt.sign(tokenData, JWT_SECRET, { expiresIn: '1d' });
  return { userDetails: user, isFound: true, userToken: token, userType: user.userType, userImage, userIdToken };
};

const registerCoordinator = async (user: Partial<User>): Promise<void> => {
  const institutionId = user.institutionId as number;
  const programId = user.programId as number;
  const userId = user.id as string;
  const pendingProgramCoordinator: Partial<PendingProgramCoordinator> = { institutionId, programId, userId };
  const userToSave: Partial<User> = {
    ...user,
    userType: UserType.PENDING,
    institutionId: undefined,
    programId: undefined
  };
  await appDataSource.manager.transaction(async transactionalEntityManager => {
    await transactionalEntityManager.save(User, userToSave);
    await transactionalEntityManager.save(PendingProgramCoordinator, pendingProgramCoordinator);
  });
};

export const register = async (user: Partial<User>, userImage: string, userIdToken: string): Promise<loginResponse> => {
  const validatedUser = validateSchema(createUserSchema, user);
  try {
    if (validatedUser.userType === UserType.PROGRAM_COORDINATOR) {
      await registerCoordinator(validatedUser);
    } else {
      await userRepository.save(validatedUser);
    }
  } catch (e) {
    if (e instanceof QueryFailedError) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      const number = e.number;
      if (Object.values(DuplicateErrorNumbers).includes(number)) {
        const duplicate = e.message.match(/\(([^)]+)\)/)?.[1] || '';
        throw new DuplicateValueError(`Value ${duplicate} already exists`, `הערך ${duplicate} כבר קיים, אנא נסה אחר`);
      }
      throw e;
    } else {
      throw e;
    }
  }
  const userId = user.id as string;
  return login(userId, userImage, userIdToken);
};

export const updateUserInfo = (id: string, userInfo: Partial<User>): Promise<UpdateResult> => {
  return userRepository.update({ id }, validateSchema(selfUpdateUserSchema, userInfo));
};

export const updateUserInstitutionId = async (
  caller: userDecoded,
  targetUserId: string,
  newInstitutionId: number
): Promise<void> => {
  const targetUser = await userRepository.findOneBy({ id: targetUserId });
  if (!targetUser) throw new NotFoundError('User not found');
  if (targetUser.userType !== UserType.PROGRAM_COORDINATOR) {
    throw new CannotPerformOperationError('Target user is not a coordinator');
  }
  if (caller.programId !== targetUser.programId) {
    throw new AuthorizationError('Trying to access different program coordinator');
  }
  await userRepository.update({ id: targetUserId }, { institutionId: newInstitutionId });
};

export const removePersonalInfo = async (caller: userDecoded): Promise<void> => {
  if (caller.userType == UserType.VOLUNTEER) {
    await volunteerRequestRepository.unassignFromOpenRequests(caller.userId);
  }
  const newEmail = `${uuidv4()}@delete.techmodel`;
  const newPhone = uuidv4();
  const newId = uuidv4();
  await userRepository.update(
    { id: caller.userId },
    { email: newEmail, phone: newPhone, firstName: 'deleted', lastName: 'deleted', id: newId, oldId: caller.userId }
  );
  if ([UserType.PROGRAM_COORDINATOR, UserType.PROGRAM_MANAGER].includes(caller.userType)) {
    await volunteerRequestRepository.updateCreatorIdForOldRequests(caller.userId, newId);
  }
};
