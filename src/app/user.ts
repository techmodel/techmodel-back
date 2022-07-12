import * as jwt from 'jsonwebtoken';
import { UpdateResult } from 'typeorm';
import { JWT_SECRET } from '../config';
import { BadRequestError, CannotPerformOperationError, ObjectValidationError } from '../exc';
import logger from '../logger';
import { User, UserType } from '../models';
import { userRepository } from '../repos';
import { userSchema } from '../schema.validators';

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

const validator = (user: User): User => {
  const { error } = userSchema.validate(user);

  if (error) {
    logger.info(`Error inserting user, id: ${user.id}`);
    throw new ObjectValidationError(error.message);
  }

  return user;
};

const arePropertiesValidOnType = (user: Partial<User>, userType: UserType): boolean => {
  return (
    (userType == UserType.VOLUNTEER && !(user.institutionId || user.programId)) ||
    (userType == UserType.PROGRAM_COORDINATOR && !user.companyId) ||
    (userType == UserType.PROGRAM_MANAGER && !(user.companyId || user.institutionId))
  );
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
  if (!arePropertiesValidOnType(user, user.userType as UserType)) {
    throw new CannotPerformOperationError(`Can't create inaccessible user info`);
  }
  await userRepository.save(user);
  return login(user.id);
};

export const updateUserInfo = (userId: string, userType: UserType, userInfo: Partial<User>): Promise<UpdateResult> => {
  if (!arePropertiesValidOnType(userInfo, userType)) {
    throw new CannotPerformOperationError(`Can't update inaccessible user info`);
  }
  return userRepository.update({ id: userId }, { ...userInfo });
};
