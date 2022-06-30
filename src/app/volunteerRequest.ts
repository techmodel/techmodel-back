import { VolunteerRequest } from '../models';
import { volunteerRequestRepository } from '../repos/volunteerRequestRepo';

export const getRelevantAndOpenVolunteerRequests = async (): Promise<VolunteerRequest[]> => {
  return volunteerRequestRepository.relevantAndOpen();
};
