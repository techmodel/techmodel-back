import { UserType } from '../../models';

export interface ReturnVolunteerDTO {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  userType: UserType;
  companyName: string;
}
