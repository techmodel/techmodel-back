import { UpdateResult } from 'typeorm';
import { skillToVolunteerRequestRepository } from '../../tests/seed';
import { AuthorizationError, BadRequestError, CannotPerformOperationError, NotFoundError } from '../exc';
import logger from '../logger';
import { RequestStatus, User, UserType, VolunteerRequest } from '../models';
import { volunteerRequestRepository } from '../repos/volunteerRequestRepo';
import {
  CreateVolunteerRequestDTO,
  mapCreateVolunteerRequestDtoToDomain,
  mapUpdateVolunteerRequestDtoToDomain,
  mapVolunteerRequestToReturnVolunteerRequestDTO,
  ReturnVolunteerRequestDTO,
  UpdateVolunteerRequestDTO
} from './dto/volunteerRequest';
import { validateSchema, updateVolunteerRequestSchema, createVolunteerRequestSchema } from './schema.validators';
import { userDecoded } from './user';

const userAndPayloadSameProgram = (user: Partial<User>, payload: any): boolean => {
  return user.programId === payload.programId;
};

const userAndPayloadSameInstitution = (user: Partial<User>, payload: any): boolean => {
  return user.institutionId === payload.institutionId;
};

export const getRelevantAndOpenVolunteerRequests = async (): Promise<ReturnVolunteerRequestDTO[]> => {
  const domainVrs = await volunteerRequestRepository.relevantAndOpen();
  return domainVrs.map(vr => mapVolunteerRequestToReturnVolunteerRequestDTO(vr));
};

export const getVolunteerRequestsOfProgram = async (
  programId: number,
  institutionId?: number,
  startDate?: string
): Promise<ReturnVolunteerRequestDTO[]> => {
  const domainVrs = await volunteerRequestRepository.requestsOfProgram(programId, institutionId, startDate);
  return domainVrs.map(vr => mapVolunteerRequestToReturnVolunteerRequestDTO(vr));
};

export const createVolunteerRequest = async (
  createVolunteerRequestDTO: CreateVolunteerRequestDTO,
  caller: userDecoded
): Promise<VolunteerRequest> => {
  const validatedVolunteerRequestDTO = validateSchema(createVolunteerRequestSchema, createVolunteerRequestDTO);
  const volunteerRequest = mapCreateVolunteerRequestDtoToDomain(validatedVolunteerRequestDTO);
  if (
    caller.userType === UserType.PROGRAM_COORDINATOR &&
    (!userAndPayloadSameProgram(caller, volunteerRequest) || !userAndPayloadSameInstitution(caller, volunteerRequest))
  ) {
    throw new AuthorizationError('Coordinator cant create request for other program or institution');
  }
  if (caller.userType === UserType.PROGRAM_MANAGER && !userAndPayloadSameProgram(caller, volunteerRequest)) {
    throw new AuthorizationError('Manager cant create request for other program');
  }
  volunteerRequest['status'] = RequestStatus.SENT;
  return volunteerRequestRepository.save(volunteerRequest);
};

// add update dto to handle skill changes
export const updateVolunteerRequest = async (
  id: number,
  volunteerRequestInfo: UpdateVolunteerRequestDTO,
  caller: userDecoded
): Promise<UpdateResult> => {
  if (!id) throw new BadRequestError('Missing Id to update volunteer request by');
  const targetVolunteerRequest = (await volunteerRequestRepository.requestById(id)) as VolunteerRequest;
  if (
    caller.userType === UserType.PROGRAM_COORDINATOR &&
    (!userAndPayloadSameProgram(caller, targetVolunteerRequest) ||
      !userAndPayloadSameInstitution(caller, targetVolunteerRequest))
  ) {
    throw new AuthorizationError('Coordinator cant update request for other program or institution');
  }
  if (caller.userType === UserType.PROGRAM_MANAGER && !userAndPayloadSameProgram(caller, targetVolunteerRequest)) {
    throw new AuthorizationError('Manager cant update request for other program');
  }
  const validatedDTO = validateSchema(updateVolunteerRequestSchema, volunteerRequestInfo);
  const updatePayload = mapUpdateVolunteerRequestDtoToDomain(validatedDTO);
  updatePayload['updatedAt'] = new Date();
  // handle skill insert independently because typeorm causes errors if its inside the update statement
  if (validatedDTO.skills) {
    await skillToVolunteerRequestRepository.delete({ volunteerRequestId: id });
    await skillToVolunteerRequestRepository.save(
      validatedDTO.skills.map(skill => ({
        skillId: skill,
        volunteerRequestId: id
      }))
    );
  }
  return volunteerRequestRepository.update({ id }, { ...updatePayload, skillToVolunteerRequest: undefined });
};

export const assignVolunteerToRequest = async (userId: string, volunteerRequestId: number): Promise<void> => {
  const targetVolunteerRequest = await volunteerRequestRepository.requestById(volunteerRequestId);
  if (!targetVolunteerRequest) {
    throw new NotFoundError('Volunteer request not found');
  }
  if (targetVolunteerRequest.startDate < new Date()) {
    throw new CannotPerformOperationError('Cannot assign volunteer to old request');
  }
  if (targetVolunteerRequest.volunteerRequestToVolunteer.length >= targetVolunteerRequest.totalVolunteers) {
    throw new CannotPerformOperationError('Volunteer request is full');
  }
  await volunteerRequestRepository.assignVolunteerToRequest(volunteerRequestId, userId);
};

export const getVolunteerRequestsByUser = async (userId: string): Promise<VolunteerRequest[]> => {
  return volunteerRequestRepository.volunteerRequestsByVolunteerId(userId);
};

export const deleteVolunteerFromRequest = async (
  caller: userDecoded,
  volunteerId: string,
  volunteerRequestId: number
): Promise<void> => {
  if (caller.userType === UserType.VOLUNTEER && caller.userId !== volunteerId) {
    throw new AuthorizationError('As a volunteer, you are not allowed to delete this volunteer');
  }
  const targetVolunteerRequest = await volunteerRequestRepository.requestById(volunteerRequestId);
  if (!targetVolunteerRequest) {
    throw new NotFoundError('Volunteer request not found');
  }
  logger.info({
    ci: caller.institutionId,
    cp: caller.programId,
    vri: targetVolunteerRequest.institutionId,
    vrp: targetVolunteerRequest.programId
  });

  if (caller.userType === UserType.PROGRAM_MANAGER && !userAndPayloadSameProgram(caller, targetVolunteerRequest)) {
    throw new AuthorizationError('As a program manager, you are not allowed to delete this volunteer');
  }
  if (
    caller.userType === UserType.PROGRAM_COORDINATOR &&
    (!userAndPayloadSameProgram(caller, targetVolunteerRequest) ||
      !userAndPayloadSameInstitution(caller, targetVolunteerRequest))
  ) {
    throw new AuthorizationError('As a program coordinator, you are not allowed to delete this volunteer');
  }
  if (targetVolunteerRequest.startDate < new Date()) {
    throw new CannotPerformOperationError('Cannot delete mapped volunteers from old request');
  }
  await volunteerRequestRepository.deleteVolunteerFromRequest(volunteerRequestId, volunteerId);
};

export const setVolunteerRequestAsDeleted = async (caller: userDecoded, requestId: number): Promise<void> => {
  if (caller.userType === UserType.VOLUNTEER) {
    throw new AuthorizationError('As a volunteer, you are not allowed to perform this operation');
  }
  const targetVolunteerRequest = await volunteerRequestRepository.requestById(requestId);
  if (!targetVolunteerRequest) {
    throw new NotFoundError('Volunteer request not found');
  }
  if (caller.userType === UserType.PROGRAM_MANAGER && !userAndPayloadSameProgram(caller, targetVolunteerRequest)) {
    throw new AuthorizationError('As a program manager, you are not allowed to delete this request');
  }
  if (
    caller.userType === UserType.PROGRAM_COORDINATOR &&
    (!userAndPayloadSameProgram(caller, targetVolunteerRequest) ||
      userAndPayloadSameInstitution(caller, targetVolunteerRequest))
  ) {
    throw new AuthorizationError('As a program coordinator, you are not allowed to delete this request');
  }
  if (targetVolunteerRequest.startDate < new Date()) {
    throw new CannotPerformOperationError('Cannot delete old request');
  }
  await volunteerRequestRepository.setVolunteerRequestAsDeleted(requestId);
};
