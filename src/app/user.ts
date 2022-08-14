import * as jwt from 'jsonwebtoken';
import { UpdateResult } from 'typeorm';
import { JWT_SECRET } from '../config';
import { AuthorizationError, BadRequestError, CannotPerformOperationError, NotFoundError } from '../exc';
import { User, UserType } from '../models';
import { userRepository } from '../repos';
import { createUserSchema, selfUpdateUserSchema, validateSchema } from './schema.validators';

type loginResponse = {
  userDetails: User | null;
  isFound: boolean;
  userToken: string;
  userType: UserType | null;
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

export const login = async (userId: string): Promise<loginResponse> => {
  const user = await userRepository.findOneBy({ id: userId });
  if (!userId || !user) {
    return { userDetails: null, isFound: false, userToken: '', userType: null };
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
  return { userDetails: user, isFound: true, userToken: token, userType: user.userType };
};

export const register = async (user: Partial<User>): Promise<loginResponse> => {
  if (!user.id) throw new BadRequestError('Missing userId');
  await userRepository.save(validateSchema(createUserSchema, user));
  return login(user.id);
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
