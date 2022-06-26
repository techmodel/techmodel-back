import { getCustomRepository } from 'typeorm';
import { UserRepository } from '../repos';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

export const login = async (userId: number) => {
  const userRepository = getCustomRepository(UserRepository);
  const user = await userRepository.findOne({ id: userId });
  if (!user) {
    return { userDetails: null, isFound: false, userToken: null, userType: null };
  }
  const tokenData = { userType: user.userType, userId };
  const token = sign(tokenData, JWT_SECRET, { expiresIn: '1d' });
  return { userDetails: user, isFound: true, userToken: token, userType: user.userType };
};
