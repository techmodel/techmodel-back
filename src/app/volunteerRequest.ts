import { VolunteerRequest } from '../models';
import { volunteerRequestRepository } from '../repos/volunteerRequestRepo';

export const getRelevantAndOpenVolunteerRequests = async (): Promise<VolunteerRequest[]> => {
  return volunteerRequestRepository.relevantAndOpen();
};

export const assignVolunteerToRequest = async (userId: string, volunteerRequestId: number): Promise<void> => {
  await volunteerRequestRepository.assignVolunteerToRequest(volunteerRequestId, userId);
};

export const getVolunteerRequestsByUser = async (userId: string): Promise<VolunteerRequest[]> => {
  return volunteerRequestRepository.volunteerRequestsByVolunteerId(userId);
};

export const deleteVolunteerFromRequest = async (volunteerId: string, volunteerRequestId: number): Promise<void> => {
  await volunteerRequestRepository.deleteVolunteerFromRequest(volunteerRequestId, volunteerId);
};
