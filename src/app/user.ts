import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import { User, UserType } from '../models';
import { userRepository } from '../repos';

type loginResponse = {
  userDetails: User | null;
  isFound: boolean;
  userToken: string;
  userType: UserType | null;
};

export type userDecoded = {
  userId: string;
  userType: UserType;
  institutionId: number | undefined;
  programId: number | undefined;
  companyId: number | undefined;
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
  if (!user.id) throw new Error('Missing userId');
  await userRepository.save(user);
  return login(user.id);
};
