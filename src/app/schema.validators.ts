import Joi, { number } from 'joi';
import { ObjectValidationError } from '../exc';
import logger from '../logger';
import { Language, RequestStatus } from '../models';
import { UserType } from '../models/userType';
import { subMinutes } from 'date-fns';

const onlyNull = Joi.valid(null);

export const userSchema = Joi.object({
  id: Joi.string()
    .min(30)
    .required(),
  firstName: Joi.string().min(2),
  lastName: Joi.string().min(2),
  phone: Joi.string().min(10),
  email: Joi.string().email(),
  userType: Joi.string().valid(...Object.values(UserType)),
  companyId: Joi.when('userType', {
    is: UserType.VOLUNTEER,
    then: Joi.number(),
    otherwise: onlyNull
  }),
  programId: Joi.when('userType', {
    is: [UserType.PROGRAM_COORDINATOR, UserType.PROGRAM_MANAGER],
    then: Joi.number(),
    otherwise: onlyNull
  }),
  institutionId: Joi.when('userType', {
    is: UserType.PROGRAM_COORDINATOR,
    then: Joi.number(),
    otherwise: onlyNull
  })
});

export const volunteerRequestSchema = Joi.object({
  name: Joi.string().min(2),
  audience: Joi.number().min(2),
  isPhysical: Joi.boolean(),
  description: Joi.string()
    .min(2)
    .max(100),
  startDate: Joi.date().greater(new Date()),
  endDate: Joi.date().min(Joi.ref('startDate')),
  duration: Joi.string(),
  startTime: Joi.date().min(subMinutes(new Date(), 1)),
  totalVolunteers: Joi.number().min(1),
  language: Joi.string().valid(...Object.values(Language))
});

export const validateSchema = <T>(schema: Joi.ObjectSchema, objectToValidate: T): T => {
  const { error } = schema.validate(objectToValidate);

  if (error) {
    throw new ObjectValidationError(`Error validating schema, ${error.message}`);
  }

  return objectToValidate;
};
