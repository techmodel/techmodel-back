import { UserType } from './userType';

export type userDecoded = {
  userId: number;
  userType: UserType;
  iat: number;
  exp: number;
};
