import {
  City,
  Company,
  Institution,
  InstitutionType,
  Language,
  Location,
  PendingProgramManager,
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
import * as dfns from 'date-fns';

export const TEST_DATE_28_06_2022 = new Date('2022-06-28T15:20:21.470Z');
export const TEST_DATE_20_06_2022 = dfns.subDays(TEST_DATE_28_06_2022, 8);
export const TEST_DATE_NOW = new Date();
export const TEST_DATE_NOW_MINUS_FIVE_DAYS = dfns.subDays(TEST_DATE_NOW, 5);
export const TEST_DATE_NOW_MINUS_TWO_DAYS = dfns.subDays(TEST_DATE_NOW, 2);
export const TEST_DATE_NOW_PLUS_TWO_DAYS = dfns.addDays(TEST_DATE_NOW, 2);
export const TEST_DATE_NOW_PLUS_FIVE_DAYS = dfns.addDays(TEST_DATE_NOW, 5);

export const city1 = {
  id: 1,
  name: 'haifa'
} as City;

export const city2 = {
  id: 2,
  name: 'tel-aviv'
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

export const institution2 = {
  id: 2,
  createdAt: TEST_DATE_20_06_2022,
  name: 'institution2',
  address: 'address2',
  locationId: location1.id,
  cityId: city2.id,
  populationType: PopulationType.JEWISH_SECULAR,
  institutionType: InstitutionType.HIGH
} as Institution;

export const program1 = {
  id: 1,
  name: 'program1',
  description: 'program description 1'
} as Program;

export const program2 = {
  id: 2,
  name: 'program2',
  description: 'program description 2'
} as Program;

export const company1 = {
  id: 1,
  name: 'company1',
  description: 'company description 1'
} as Company;

export const company2 = {
  id: 2,
  name: 'company2',
  description: 'company description 2'
} as Company;

export const volunteer1 = {
  id: ''.padEnd(36, 'a'),
  firstName: 'volunteer1',
  lastName: 'volunteer1',
  createdAt: TEST_DATE_20_06_2022,
  email: 'volunteer1@gmail.com',
  phone: '111111111',
  userType: UserType.VOLUNTEER,
  companyId: company1.id
} as User;

export const volunteer2 = {
  id: ''.padEnd(36, 'b'),
  firstName: 'volunteer2',
  lastName: 'volunteer2',
  createdAt: TEST_DATE_20_06_2022,
  email: 'volunteer2@gmail.com',
  phone: '213213',
  userType: UserType.VOLUNTEER,
  companyId: company2.id
} as User;

export const volunteer3WithoutMappings = {
  id: ''.padEnd(36, 'c'),
  firstName: 'volunteer3WithoutMappings',
  lastName: 'volunteer3WithoutMappings',
  createdAt: TEST_DATE_20_06_2022,
  email: 'volunteer3WithoutMappings@gmail.com',
  phone: '213213452',
  userType: UserType.VOLUNTEER,
  companyId: company1.id
} as User;

export const programManager1 = {
  id: ''.padEnd(36, 'd'),
  firstName: 'prgoramManager1',
  lastName: 'prgoramManager1',
  createdAt: TEST_DATE_20_06_2022,
  email: 'prgoramManager1@gmail.com',
  phone: '5342',
  userType: UserType.PROGRAM_MANAGER,
  programId: program1.id
} as User;

export const programManager2 = {
  id: ''.padEnd(36, 'e'),
  firstName: 'prgoramManager2',
  lastName: 'prgoramManager2',
  createdAt: TEST_DATE_20_06_2022,
  email: 'prgoramManager2@gmail.com',
  phone: '53426356356',
  userType: UserType.PROGRAM_MANAGER,
  programId: program2.id
} as User;

export const programCoordinator1 = {
  id: ''.padEnd(36, 'f'),
  firstName: 'programCoordinator1',
  lastName: 'programCoordinator1',
  createdAt: TEST_DATE_20_06_2022,
  email: 'programCoordinator1@gmail.com',
  phone: '654634634',
  userType: UserType.PROGRAM_COORDINATOR,
  programId: program1.id,
  institutionId: institution1.id
} as User;

export const programCoordinator2 = {
  id: ''.padEnd(36, 'g'),
  firstName: 'programCoordinator2',
  lastName: 'programCoordinator2',
  createdAt: TEST_DATE_20_06_2022,
  email: 'programCoordinator2@gmail.com',
  phone: '141617',
  userType: UserType.PROGRAM_COORDINATOR,
  programId: program1.id,
  institutionId: institution2.id
} as User;

export const programCoordinator3 = {
  id: ''.padEnd(20, 'f'),
  firstName: 'programCoordinator3',
  lastName: 'programCoordinator3',
  createdAt: TEST_DATE_20_06_2022,
  email: 'programCoordinator3@gmail.com',
  phone: '6546345555',
  userType: UserType.PROGRAM_COORDINATOR,
  programId: program2.id,
  institutionId: institution2.id
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
  institutionId: institution1.id,
  programId: programManager1.programId,
  language: Language.ARABIC
} as VolunteerRequest;

export const oldVolunteerRequest1 = {
  id: 2,
  createdAt: TEST_DATE_28_06_2022,
  name: 'oldVolunteerRequest1',
  audience: 12,
  isPhysical: true,
  description: 'oldVolunteerRequest1 description',
  startDate: TEST_DATE_NOW_MINUS_FIVE_DAYS,
  endDate: TEST_DATE_NOW_MINUS_TWO_DAYS,
  duration: '2 hour',
  startTime: new Date(),
  totalVolunteers: 4,
  status: RequestStatus.SENT,
  institutionId: institution1.id,
  programId: programManager1.programId,
  language: Language.HEBREW
} as VolunteerRequest;

export const fullVolunteerRequest1 = {
  id: 3,
  createdAt: TEST_DATE_28_06_2022,
  name: 'fullVolunteerRequest1',
  audience: 2,
  isPhysical: true,
  description: 'fullVolunteerRequest1 description',
  startDate: TEST_DATE_NOW_PLUS_TWO_DAYS,
  endDate: TEST_DATE_NOW_PLUS_FIVE_DAYS,
  duration: '1 hour',
  startTime: new Date(),
  totalVolunteers: 1,
  status: RequestStatus.SENT,
  institutionId: institution2.id,
  programId: programManager1.programId,
  language: Language.RUSSIAN
} as VolunteerRequest;

export const volunteerRequestToCreate = {
  id: 4,
  createdAt: TEST_DATE_28_06_2022,
  name: 'volunteerRequestToCreate',
  audience: 12,
  isPhysical: false,
  description: 'volunteerRequestToCreate description',
  startDate: TEST_DATE_NOW_PLUS_TWO_DAYS,
  endDate: TEST_DATE_NOW_PLUS_FIVE_DAYS,
  duration: '1 hour',
  startTime: new Date(),
  totalVolunteers: 3,
  status: RequestStatus.SENT,
  institutionId: institution1.id,
  programId: programManager1.programId,
  language: Language.HEBREW
} as VolunteerRequest;

export const volunteerRequestToUpdate = {
  id: 5,
  createdAt: TEST_DATE_28_06_2022,
  name: 'volunteerRequestToUpdate',
  audience: 12,
  isPhysical: false,
  description: 'volunteerRequestToUpdate description',
  startDate: TEST_DATE_NOW_PLUS_TWO_DAYS,
  endDate: TEST_DATE_NOW_PLUS_FIVE_DAYS,
  duration: '1 hour',
  startTime: new Date(),
  totalVolunteers: 3,
  status: RequestStatus.SENT,
  institutionId: programCoordinator2.institutionId,
  programId: programCoordinator2.programId,
  language: Language.HEBREW
} as VolunteerRequest;

export const volunteerRequestInstitution1Program2 = {
  id: 324,
  createdAt: TEST_DATE_28_06_2022,
  name: 'volunteerRequestInstitution1Program2',
  audience: 12,
  isPhysical: true,
  description: 'volunteerRequestInstitution1Program2 description',
  startDate: TEST_DATE_NOW_PLUS_TWO_DAYS,
  endDate: TEST_DATE_NOW_PLUS_FIVE_DAYS,
  duration: '1 hour',
  startTime: new Date(),
  totalVolunteers: 4,
  status: RequestStatus.SENT,
  institutionId: institution2.id,
  programId: program2.id,
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

export const oldVolunteerRequest1ToVolunteer1 = {
  volunteerId: volunteer1.id,
  volunteerRequestId: oldVolunteerRequest1.id
} as VolunteerRequestToVolunteer;

export const fullVolunteerRequest1ToVolunteer1 = {
  volunteerId: volunteer1.id,
  volunteerRequestId: fullVolunteerRequest1.id
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

export const volunteerRequestToVolunteers = [
  volunteerRequest1ToVolunteer1,
  volunteerRequest1ToVolunteer2,
  oldVolunteerRequest1ToVolunteer1,
  fullVolunteerRequest1ToVolunteer1
];

export const pendingProgramManager3 = {
  id: ''.padEnd(15, 'a').padEnd(11, 'b'),
  firstName: 'pendingProgramManager3',
  lastName: 'pendingProgramManager3',
  createdAt: TEST_DATE_28_06_2022,
  email: 'pendingProgramManager3@gmail.com',
  phone: '1111154343',
  userType: UserType.PENDING
} as User;

export const pendingProgramManager3SecondPart = {
  id: 1,
  userId: pendingProgramManager3.id,
  programId: program1.id,
  createdAt: TEST_DATE_28_06_2022
} as PendingProgramManager;
