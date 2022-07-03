import {
  City,
  Company,
  Institution,
  InstitutionType,
  Language,
  Location,
  PopulationType,
  Program,
  RequestStatus,
  Skill,
  SkillToVolunteerRequest,
  User,
  UserType,
  VolunteerRequest,
  VolunteerRequestToVolunteer
} from '../src/models';

export const TEST_DATE_28_06_2022 = new Date('2022-06-28T15:20:21.470Z');
export const TEST_DATE_20_06_2022 = new Date('2022-06-20T15:20:21.470Z');
export const TEST_DATE_NOW = new Date();
export const TEST_DATE_NOW_MINUS_TWO_DAYS = new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000);
export const TEST_DATE_NOW_PLUS_TWO_DAYS = new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000);
export const TEST_DATE_NOW_PLUS_FIVE_DAYS = new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000);

export const city1 = {
  id: 1,
  name: 'haifa'
} as City;

export const location1 = {
  id: 1,
  name: 'north'
} as Location;

export const institution1 = {
  id: 1,
  createdAt: TEST_DATE_20_06_2022,
  name: 'institution1',
  address: 'address1',
  locationId: location1.id,
  cityId: city1.id,
  populationType: PopulationType.JEWISH_SECULAR,
  institutionType: InstitutionType.ELEMENTARY
} as Institution;

export const program1 = {
  id: 1,
  createdAt: TEST_DATE_20_06_2022,
  name: 'program1',
  description: 'program description 1'
} as Program;

export const company1 = {
  id: 1,
  createdAt: TEST_DATE_20_06_2022,
  name: 'company1',
  description: 'company description 1'
} as Company;

export const company2 = {
  id: 2,
  createdAt: TEST_DATE_20_06_2022,
  name: 'company2',
  description: 'company description 2'
} as Company;

export const volunteer1 = {
  id: 'volunteerid1',
  firstName: 'volunteer1',
  lastName: 'volunteer1',
  createdAt: TEST_DATE_20_06_2022,
  email: 'volunteer1@gmail.com',
  phone: '111111111',
  userType: UserType.VOLUNTEER,
  companyId: company1.id
} as User;

export const volunteer2 = {
  id: 'volunteerid2',
  firstName: 'volunteer2',
  lastName: 'volunteer2',
  createdAt: TEST_DATE_20_06_2022,
  email: 'volunteer2@gmail.com',
  phone: '213213',
  userType: UserType.VOLUNTEER,
  companyId: company2.id
} as User;

export const programManager1 = {
  id: 'programManagerid1',
  firstName: 'prgoramManager1',
  lastName: 'prgoramManager1',
  createdAt: TEST_DATE_20_06_2022,
  email: 'prgoramManager1@gmail.com',
  phone: '5342',
  userType: UserType.PROGRAM_MANAGER,
  programId: program1.id
} as User;

export const volunteerRequest1 = {
  id: 1,
  createdAt: TEST_DATE_28_06_2022,
  name: 'volunteerRequest1',
  audience: 12,
  isPhysical: true,
  description: 'volunteerRequest1 description',
  startDate: TEST_DATE_NOW_PLUS_TWO_DAYS,
  endDate: TEST_DATE_NOW_PLUS_FIVE_DAYS,
  duration: '1 hour',
  startTime: new Date(),
  totalVolunteers: 4,
  status: RequestStatus.SENT,
  creatorId: programManager1.id,
  language: Language.ARABIC
} as VolunteerRequest;

export const volunteerRequest1ToVolunteer1 = {
  volunteerId: volunteer1.id,
  volunteerRequestId: volunteerRequest1.id
} as VolunteerRequestToVolunteer;

export const volunteerRequest1ToVolunteer2 = {
  volunteerId: volunteer2.id,
  volunteerRequestId: volunteerRequest1.id
} as VolunteerRequestToVolunteer;

export const skill1 = {
  id: 1,
  name: 'skill1',
  type: 'type1'
} as Skill;

export const skill2 = {
  id: 2,
  name: 'skill2',
  type: 'type1'
} as Skill;

export const skill1ToVolunteerRequest1 = {
  id: 1,
  skillId: skill1.id,
  volunteerRequestId: volunteerRequest1.id
} as SkillToVolunteerRequest;

export const skill2ToVolunteerRequest1 = {
  id: 2,
  skillId: skill2.id,
  volunteerRequestId: volunteerRequest1.id
} as SkillToVolunteerRequest;
