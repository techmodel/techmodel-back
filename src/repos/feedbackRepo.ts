import { appDataSource } from '../dataSource';
import { Feedback } from '../models';

export const feedbackRepository = appDataSource.getRepository(Feedback).extend({
  async getFeedback(userId: string | null, volunteerRequestId: string): Promise<Feedback[]> {
    const query = this.createQueryBuilder('feedback').leftJoinAndSelect('feedback.user', 'user'); // Use the correct relation name 'user'

    query.where('feedback.volunteerRequestId = :volunteerRequestId', { volunteerRequestId });

    if (userId !== null) {
      query.andWhere('feedback.userId = :userId', { userId });
    }

    return query.getMany();
  }
});
