import { Feedback } from '../models';
import { feedbackRepository } from '../repos';

export const getFeedback = (): Promise<Feedback[]> => {
  return feedbackRepository.find();
};
