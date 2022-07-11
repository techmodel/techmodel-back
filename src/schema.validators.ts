import Joi from 'joi';
import { Language, RequestStatus } from './models';
import { UserType } from './models/userType';

const onlyNull = Joi.valid(null);

export const userSchema = Joi.object({
  id: Joi.string()
    .min(30)
    .required(),
  firstName: Joi.string()
    .min(2)
    .required(),
  lastName: Joi.string()
    .min(2)
    .required(),
  phone: Joi.string()
    .min(10)
    .required(),
  email: Joi.string()
    .email()
    .required(),
  userType: Joi.string()
    .valid(...Object.values(UserType))
    .required(),
  companyId: Joi.number().when('userType', {
    is: UserType.VOLUNTEER,
    then: Joi.number().required(),
    otherwise: onlyNull
  }),
  programId: Joi.number().when('userType', {
    is: UserType.VOLUNTEER,
    then: onlyNull,
    otherwise: Joi.number().required()
  }),
  institutionId: Joi.number().when('userType', {
    is: UserType.PROGRAM_COORDINATOR,
    then: Joi.number().required(),
    otherwise: onlyNull
  })
});

export const volunteerRequestSchema = Joi.object({
  id: Joi.number().required(),
  name: Joi.string()
    .min(2)
    .required(),
  audience: Joi.string()
    .min(2)
    .required(),
  isPhysical: Joi.boolean().required(),
  description: Joi.string()
    .min(2)
    .max(100)
    .required(),
  startDate: Joi.date()
    .greater(new Date())
    .required(),
  endDate: Joi.date()
    .greater('startDate')
    .required(),
  duration: Joi.string().required(),
  startTime: Joi.date()
    .greater(new Date())
    .required(),
  totalVolunteers: Joi.number().required(),
  currentVolunteers: Joi.number(),
  status: Joi.string()
    .valid(...Object.values(RequestStatus))
    .required(),
  creatorId: Joi.string()
    .min(30)
    .required(),
  language: Joi.string().valid(...Object.values(Language))
});
