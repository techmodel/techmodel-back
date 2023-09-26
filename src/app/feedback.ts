import { Feedback } from '../models';
import { CreateFeedbackDTO } from './dto/feedback';
import { feedbackRepository } from '../repos';
import { validateSchema, createFeedbackSchema } from './schema.validators';

// export const getFeedback = async (userId: string | null, volunteerRequestId: string): Promise<Feedback[]> => {
//   const query = feedbackRepository.createQueryBuilder('feedback')
//   // .leftJoinAndSelect('feedback.users', 'user')

//   // Add conditions
//   query.where('feedback.volunteerRequestId = :volunteerRequestId', { volunteerRequestId });

//   // Conditionally add the userId condition if it is provided
//   if (userId !== null) {
//     query.andWhere('feedback.userId = :userId', { userId });
//   }

//   // Execute the query
//   return query.getMany();
// };

export const createFeedback = async (createFeedbackDTO: CreateFeedbackDTO): Promise<Feedback> => {
  validateSchema(createFeedbackSchema, createFeedbackDTO);

  const updatedObject = {
    ...createFeedbackDTO,
    createdAt: new Date()
  };
  return feedbackRepository.save(updatedObject);
};
