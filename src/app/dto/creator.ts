import { UserType } from '../../models';

export interface ReturnCreatorDTO {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  userType: UserType;
  programId: number | null;
  institutionId?: number | null;
}
