import { getCustomRepository } from 'typeorm';
import { UserRepository } from '../repos';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import { User, UserType } from '../models';

type loginResponse = {
  userDetails: User | null;
  isFound: boolean;
  userToken: string;
  userType: UserType | null;
};

export const login = async (userId: number): Promise<loginResponse> => {
  const userRepository = getCustomRepository(UserRepository);
  const user = await userRepository.findOne({ id: userId });
  if (!user) {
    return { userDetails: null, isFound: false, userToken: '', userType: null };
  }
  const tokenData = { userType: user.userType, userId };
  const token = sign(tokenData, JWT_SECRET, { expiresIn: '1d' });
  return { userDetails: user, isFound: true, userToken: token, userType: user.userType };
};
