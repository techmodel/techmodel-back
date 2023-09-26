import { Feedback } from '../models';
import { CreateFeedbackDTO } from './dto/feedback';
import { feedbackRepository } from '../repos';
import { validateSchema, createFeedbackSchema } from './schema.validators';

export const createFeedback = async (createFeedbackDTO: CreateFeedbackDTO): Promise<Feedback> => {
  validateSchema(createFeedbackSchema, createFeedbackDTO);
  return feedbackRepository.save(createFeedbackDTO);
};

export const getFeedback = async (volunteerRequestId: number, userId: string): Promise<Feedback[]> => {
  return await feedbackRepository.getFeedback(volunteerRequestId, userId);
};
