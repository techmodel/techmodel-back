import {
  Audience,
  City,
  Company,
  Institution,
  InstitutionType,
  Language,
  Location,
  PendingProgramCoordinator,
  PendingProgramManager,
  PopulationType,
  Program,
  ProgramToInstitution,
  RequestStatus,
  Feedback,
  Skill,
  SkillToVolunteerRequest,
  TimeUnit,
  User,
  UserType,
  VolunteerRequest,
  VolunteerRequestToVolunteer
} from '../src/models';
import * as dfns from 'date-fns';
import { CreateVolunteerRequestDTO } from '../src/app/dto/volunteerRequest';
import { CreateInstitutionDTO } from '../src/app/dto/institution';

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
  name: 'תל אביב'
} as City;

export const location1 = {
  id: 1,
  name: 'צפון'
} as Location;

export const institution1 = {
  id: 1,
  createdAt: TEST_DATE_20_06_2022,
  name: 'אורט אבין',
  address: 'שלם 1',
  locationId: location1.id,
  cityId: city1.id,
  populationType: PopulationType.SECULAR,
  institutionType: InstitutionType.ELEMENTARY_SCHOOL
} as Institution;

export const institution2 = {
  id: 2,
  createdAt: TEST_DATE_20_06_2022,
  name: 'יובלים',
  address: 'אליהו סעדון 79',
  locationId: location1.id,
  cityId: city2.id,
  populationType: PopulationType.SECULAR,
  institutionType: InstitutionType.HIGH_SCHOOL
} as Institution;

export const program1 = {
  id: 1,
  name: 'גשרים',
  description: 'הסבר על תוכנית גשרים'
} as Program;

export const program2 = {
  id: 2,
  name: 'לוחמים להייטק',
  description: 'הסבר על תוכנית לוחמים להייטק'
} as Program;

export const company1 = {
  id: 1,
  name: 'Facebook',
  description: 'הסבר על פייסבוק'
} as Company;

export const company2 = {
  id: 2,
  name: 'Microsoft',
  description: 'הסבר על מייקרוסופט'
} as Company;

export const volunteer1 = {
  id: ''.padEnd(20, 'a'),
  firstName: 'שמוליק.',
  lastName: 'שגב',
  createdAt: TEST_DATE_20_06_2022,
  email: 'smhuliksegev@gmail.com',
  phone: '0542345678',
  userType: UserType.VOLUNTEER,
  companyId: company1.id
} as User;

export const volunteer2 = {
  id: ''.padEnd(20, 'b'),
  firstName: 'ישראל',
  lastName: 'ישראלי',
  createdAt: TEST_DATE_20_06_2022,
  email: 'israelisraeli@gmail.com',
  phone: '0589876544',
  userType: UserType.VOLUNTEER,
  companyId: company2.id
} as User;

export const volunteer3WithoutMappings = {
  id: ''.padEnd(20, 'c'),
  firstName: 'volunteer3WithoutMappings',
  lastName: 'volunteer3WithoutMappings',
  createdAt: TEST_DATE_20_06_2022,
  email: 'volunteer3WithoutMappings@gmail.com',
  phone: '213213452',
  userType: UserType.VOLUNTEER,
  companyId: company1.id
} as User;

export const programManager1 = {
  id: ''.padEnd(20, 'd'),
  firstName: 'prgoramManager1',
  lastName: 'prgoramManager1',
  createdAt: TEST_DATE_20_06_2022,
  email: 'prgoramManager1@gmail.com',
  phone: '5342',
  userType: UserType.PROGRAM_MANAGER,
  programId: program1.id
} as User;

export const programManager2 = {
  id: ''.padEnd(20, 'e'),
  firstName: 'prgoramManager2',
  lastName: 'prgoramManager2',
  createdAt: TEST_DATE_20_06_2022,
  email: 'prgoramManager2@gmail.com',
  phone: '53426356356',
  userType: UserType.PROGRAM_MANAGER,
  programId: program2.id
} as User;

export const programCoordinator1 = {
  id: ''.padEnd(20, 'f'),
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
  id: ''.padEnd(20, 'g'),
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
  id: ''.padEnd(20, 'h'),
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
  audience: Audience.MEDIUM,
  isPhysical: true,
  description: 'volunteerRequest1 description',
  startDate: TEST_DATE_NOW_PLUS_TWO_DAYS,
  endDate: TEST_DATE_NOW_PLUS_FIVE_DAYS,
  durationTimeAmount: 1,
  durationTimeUnit: TimeUnit.HOURS,
  frequencyTimeAmount: 1,
  frequencyTimeUnit: TimeUnit.MONTHS,
  startTime: new Date(),
  totalVolunteers: 4,
  status: RequestStatus.SENT,
  institutionId: institution1.id,
  programId: programManager1.programId,
  language: Language.ARABIC,
  creatorId: programManager1.id,
  creator: programManager1
} as VolunteerRequest;

export const oldVolunteerRequest1 = {
  id: 2,
  createdAt: TEST_DATE_28_06_2022,
  name: 'oldVolunteerRequest1',
  audience: Audience.SMALL,
  isPhysical: true,
  description: 'oldVolunteerRequest1 description',
  startDate: TEST_DATE_NOW_MINUS_FIVE_DAYS,
  endDate: TEST_DATE_NOW_MINUS_TWO_DAYS,
  durationTimeAmount: 2,
  durationTimeUnit: TimeUnit.HOURS,
  frequencyTimeAmount: 2,
  frequencyTimeUnit: TimeUnit.WEEKS,
  startTime: new Date(),
  totalVolunteers: 4,
  status: RequestStatus.SENT,
  institutionId: institution1.id,
  programId: programManager1.programId,
  language: Language.HEBREW,
  creatorId: programManager1.id,
  creator: programManager1
} as VolunteerRequest;

export const fullVolunteerRequest1 = {
  id: 3,
  createdAt: TEST_DATE_28_06_2022,
  name: 'fullVolunteerRequest1',
  audience: Audience.SMALL,
  isPhysical: true,
  description: 'fullVolunteerRequest1 description',
  startDate: TEST_DATE_NOW_PLUS_TWO_DAYS,
  endDate: TEST_DATE_NOW_PLUS_FIVE_DAYS,
  durationTimeAmount: 2,
  durationTimeUnit: TimeUnit.HOURS,
  frequencyTimeAmount: 2,
  frequencyTimeUnit: TimeUnit.WEEKS,
  startTime: new Date(),
  totalVolunteers: 1,
  status: RequestStatus.SENT,
  institutionId: institution2.id,
  programId: programManager1.programId,
  language: Language.FRENCH,
  creatorId: programManager1.id,
  creator: programManager1
} as VolunteerRequest;

export const volunteerRequestToUpdate = {
  id: 5,
  createdAt: TEST_DATE_28_06_2022,
  name: 'volunteerRequestToUpdate',
  audience: Audience.SMALL,
  isPhysical: false,
  description: 'volunteerRequestToUpdate description',
  startDate: TEST_DATE_NOW_PLUS_TWO_DAYS,
  endDate: TEST_DATE_NOW_PLUS_FIVE_DAYS,
  durationTimeAmount: 2,
  durationTimeUnit: TimeUnit.HOURS,
  frequencyTimeAmount: 2,
  frequencyTimeUnit: TimeUnit.WEEKS,
  startTime: new Date(),
  totalVolunteers: 3,
  status: RequestStatus.SENT,
  institutionId: programCoordinator2.institutionId,
  programId: programCoordinator2.programId,
  language: Language.HEBREW,
  creatorId: programCoordinator2.id,
  creator: programCoordinator2
} as VolunteerRequest;

export const volunteerRequestInstitution1Program2 = {
  id: 324,
  createdAt: TEST_DATE_28_06_2022,
  name: 'volunteerRequestInstitution1Program2',
  audience: Audience.SMALL,
  isPhysical: true,
  description: 'volunteerRequestInstitution1Program2 description',
  startDate: TEST_DATE_NOW_PLUS_TWO_DAYS,
  endDate: TEST_DATE_NOW_PLUS_FIVE_DAYS,
  durationTimeAmount: 2,
  durationTimeUnit: TimeUnit.HOURS,
  frequencyTimeAmount: 2,
  frequencyTimeUnit: TimeUnit.WEEKS,
  startTime: new Date(),
  totalVolunteers: 4,
  status: RequestStatus.SENT,
  institutionId: institution2.id,
  programId: program2.id,
  language: Language.ARABIC,
  creatorId: programManager2.id,
  creator: programManager2
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

export const pendingProgramCoordinator3 = {
  id: 'pendingProgramCoordinator3',
  firstName: 'pendingProgramCoordinator3',
  lastName: 'pendingProgramCoordinator3',
  createdAt: TEST_DATE_28_06_2022,
  email: 'pendingProgramCoordinator3@gmail.com',
  phone: '1111154343',
  userType: UserType.PENDING
} as User;

export const pendingProgramCoordinator3SecondPart = {
  id: 1,
  userId: pendingProgramCoordinator3.id,
  programId: program1.id,
  institutionId: institution1.id,
  createdAt: TEST_DATE_28_06_2022
} as PendingProgramCoordinator;

export const pendingProgramCoordinator4 = {
  id: 'pendingProgramCoordinator4',
  firstName: 'pendingProgramCoordinator4',
  lastName: 'pendingProgramCoordinator4',
  createdAt: TEST_DATE_28_06_2022,
  email: 'pendingProgramCoordinator4@gmail.com',
  phone: '63541312',
  userType: UserType.PENDING
} as User;

export const pendingProgramCoordinator4SecondPart = {
  id: 2,
  userId: pendingProgramCoordinator4.id,
  programId: program2.id,
  institutionId: institution1.id,
  createdAt: TEST_DATE_28_06_2022
} as PendingProgramCoordinator;

export const volunteerRequestToCreate = {
  name: 'volunteerRequestToCreate',
  audience: Audience.XL,
  isPhysical: false,
  description: 'volunteerRequestToCreate description',
  startDate: TEST_DATE_NOW_PLUS_TWO_DAYS,
  endDate: TEST_DATE_NOW_PLUS_FIVE_DAYS,
  durationTimeAmount: 30,
  durationTimeUnit: TimeUnit.MINUTES,
  frequencyTimeAmount: 5,
  frequencyTimeUnit: TimeUnit.MONTHS,
  startTime: new Date(),
  totalVolunteers: 3,
  status: RequestStatus.SENT,
  institutionId: institution1.id,
  programId: programManager1.programId,
  language: Language.HEBREW,
  skills: [skill1.id],
  creatorId: programManager1.id,
  creator: programManager1,
  dateFlexible: false,
  meetingUrl: 'test123',
  genericUrl: 'test321'
} as CreateVolunteerRequestDTO;

export const volutneerRequestDTO1: CreateVolunteerRequestDTO = {
  name: 'test5432',
  audience: Audience.LARGE,
  isPhysical: true,
  description: 'another test',
  startDate: new Date(),
  endDate: new Date(),
  durationTimeAmount: 3,
  durationTimeUnit: TimeUnit.HOURS,
  frequencyTimeAmount: 3,
  frequencyTimeUnit: TimeUnit.MONTHS,
  startTime: new Date(),
  totalVolunteers: 5,
  institutionId: institution1.id,
  programId: program1.id,
  language: Language.ARABIC,
  skills: [skill1.id, skill2.id],
  creatorId: programCoordinator1.id,
  dateFlexible: false,
  meetingUrl: 'test123',
  genericUrl: 'test321'
};

export const program1ToInstitution1 = {
  programId: program1.id,
  institutionId: institution1.id
} as ProgramToInstitution;

export const program1ToInstitution2 = {
  programId: program1.id,
  institutionId: institution2.id
} as ProgramToInstitution;

export const createInstitutionDTO1: CreateInstitutionDTO = {
  name: 'inst1',
  address: 'somewhere',
  locationId: 1,
  cityId: 1,
  populationType: PopulationType.RELIGIOUS,
  institutionType: InstitutionType.ELEMENTARY_SCHOOL
};

export const feedback1 = {
  userId: volunteer1.id,
  volunteerRequestId: 1,
  createdAt: TEST_DATE_20_06_2022,
  review: 5,
  notes: 'TESTING THE NOTES'
} as Feedback;
