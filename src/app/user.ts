import { UserRepository } from '../repos';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import { User, UserType } from '../models';

type loginResponse = {
  userDetails: User | null;
  isFound: boolean;
  userToken: string;
  userType: UserType | null;
};

export type userDecoded = {
  userId: number;
  userType: UserType;
  iat: number;
  exp: number;
};

export const login = async (userId: number): Promise<loginResponse> => {
  const user = await UserRepository.findOne({ where: { id: userId } });
  if (!user) {
    return { userDetails: null, isFound: false, userToken: '', userType: null };
  }
  const tokenData: Partial<userDecoded> = { userType: user.userType, userId };
  const token = jwt.sign(tokenData, JWT_SECRET, { expiresIn: '1d' });
  return { userDetails: user, isFound: true, userToken: token, userType: user.userType };
};
