import { VolunteerRequest } from '../models';
import { volunteerRequestRepository } from '../repos/volunteerRequestRepo';

export const allRelevantAndOpenVolunteerRequests = async (): Promise<VolunteerRequest[]> => {
  return volunteerRequestRepository.relevantAndOpen();
};
