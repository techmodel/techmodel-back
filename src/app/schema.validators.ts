import Joi from 'joi';
import { ObjectValidationError } from '../exc';
import { Audience, Language, TimeUnit } from '../models';
import { UserType } from '../models/userType';
import { subMinutes } from 'date-fns';

const onlyNull = Joi.valid(null);
const schemaId = Joi.string()
  .min(20)
  .required();
const schemaUserType = Joi.string().valid(...Object.values(UserType));
const schemaCompanyId = Joi.when('userType', {
  is: UserType.VOLUNTEER,
  then: Joi.number(),
  otherwise: onlyNull
});
const schemaProgramId = Joi.when('userType', {
  is: [UserType.PROGRAM_COORDINATOR, UserType.PROGRAM_MANAGER],
  then: Joi.number(),
  otherwise: onlyNull
});
const schemaInstitutionId = Joi.when('userType', {
  is: UserType.PROGRAM_COORDINATOR,
  then: Joi.number(),
  otherwise: onlyNull
});
const schemaFirstName = Joi.string().min(2);
const schemaLastName = Joi.string().min(2);
const schemaPhone = Joi.string().min(10);
const schemaEmail = Joi.string().email();
const schemaTimeUnit = Joi.string().valid(...Object.values(TimeUnit));
const schemaAudience = Joi.string().valid(...Object.values(Audience));

export const createUserSchema = Joi.object({
  id: schemaId,
  firstName: schemaFirstName,
  lastName: schemaLastName,
  phone: schemaPhone,
  email: schemaEmail,
  userType: schemaUserType,
  companyId: schemaCompanyId,
  programId: schemaProgramId,
  institutionId: schemaInstitutionId
});

export const selfUpdateUserSchema = Joi.object({
  firstName: schemaFirstName,
  lastName: schemaLastName,
  phone: schemaPhone,
  email: schemaEmail,
  userType: schemaUserType,
  companyId: schemaCompanyId
});

export const updateVolunteerRequestSchema = Joi.object({
  name: Joi.string().min(2),
  audience: schemaAudience,
  isPhysical: Joi.boolean(),
  description: Joi.string()
    .min(2)
    .max(100),
  startDate: Joi.date().greater(new Date()),
  endDate: Joi.date().min(Joi.ref('startDate')),
  durationTimeAmount: Joi.number(),
  durationTimeUnit: schemaTimeUnit,
  frequencyTimeAmount: Joi.number(),
  frequencyTimeUnit: schemaTimeUnit,
  startTime: Joi.date().min(subMinutes(new Date(), 1)),
  totalVolunteers: Joi.number().min(1),
  language: Joi.string().valid(...Object.values(Language)),
  skills: Joi.array().items(Joi.number())
});

export const createVolunteerRequestSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .required(),
  audience: schemaAudience,
  isPhysical: Joi.boolean().required(),
  description: Joi.string()
    .min(2)
    .max(100)
    .required(),
  startDate: Joi.date().greater(new Date()),
  endDate: Joi.date().min(Joi.ref('startDate')),
  durationTimeAmount: Joi.number(),
  durationTimeUnit: schemaTimeUnit,
  frequencyTimeAmount: Joi.number(),
  frequencyTimeUnit: schemaTimeUnit,
  startTime: Joi.date()
    .min(subMinutes(new Date(), 1))
    .required(),
  totalVolunteers: Joi.number()
    .min(1)
    .required(),
  language: Joi.string()
    .valid(...Object.values(Language))
    .required(),
  programId: Joi.number().required(),
  institutionId: Joi.number().required(),
  creatorId: Joi.string()
    .min(20)
    .required(),
  skills: Joi.array().items(Joi.number())
});

export const validateSchema = <T>(schema: Joi.ObjectSchema, objectToValidate: T): T => {
  const { error } = schema.validate(objectToValidate);

  if (error) {
    throw new ObjectValidationError(`Error validating schema, ${error.message}`);
  }

  return objectToValidate;
};
