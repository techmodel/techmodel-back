import { AuthorizationError, CannotPerformOperationError, NotFoundError } from '../exc';
import { User, UserType, VolunteerRequest } from '../models';
import { volunteerRequestRepository } from '../repos/volunteerRequestRepo';
import { userDecoded } from './user';

export const getRelevantAndOpenVolunteerRequests = async (): Promise<VolunteerRequest[]> => {
  return volunteerRequestRepository.relevantAndOpen();
};

export const getVolunteerRequestsOfProgram = async (
  programId: number,
  institutionId?: number,
  startDate?: string
): Promise<VolunteerRequest[]> => {
  return volunteerRequestRepository.requestsOfProgram(programId, institutionId, startDate);
};

export const assignVolunteerToRequest = async (userId: string, volunteerRequestId: number): Promise<void> => {
  await volunteerRequestRepository.assignVolunteerToRequest(volunteerRequestId, userId);
};

export const getVolunteerRequestsByUser = async (userId: string): Promise<VolunteerRequest[]> => {
  return volunteerRequestRepository.volunteerRequestsByVolunteerId(userId);
};

const sameProgram = (userA: Partial<User>, userB: Partial<User>): boolean => {
  return userA.programId === userB.programId;
};

export const deleteVolunteerFromRequest = async (
  caller: userDecoded,
  volunteerId: string,
  volunteerRequestId: number
): Promise<void> => {
  if (caller.userType === UserType.VOLUNTEER && caller.userId !== volunteerId) {
    throw new AuthorizationError('As a volunteer, you are not allowed to delete this volunteer');
  }
  const targetVolunteerRequest = await volunteerRequestRepository.findOneWithCreator(volunteerRequestId);
  if (!targetVolunteerRequest) {
    throw new NotFoundError('Volunteer request not found');
  }
  const requestCreator = targetVolunteerRequest.creator;
  if (caller.userType === UserType.PROGRAM_MANAGER && !sameProgram(caller, requestCreator)) {
    throw new AuthorizationError('As a program manager, you are not allowed to delete this volunteer');
  }
  if (caller.userType === UserType.PROGRAM_COORDINATOR && caller.userId !== requestCreator.id) {
    throw new AuthorizationError('As a program coordinator, you are not allowed to delete this volunteer');
  }
  if (targetVolunteerRequest.startDate < new Date()) {
    throw new CannotPerformOperationError('Cannot delete mapped volunteers from old request');
  }
  await volunteerRequestRepository.deleteVolunteerFromRequest(volunteerRequestId, volunteerId);
};
