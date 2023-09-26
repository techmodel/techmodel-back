import { appDataSource } from '../dataSource';
import { Feedback } from '../models';

export const feedbackRepository = appDataSource.getRepository(Feedback).extend({
  async getFeedback(volunteerRequestId: number, userId?: string): Promise<Feedback[]> {
    const qb = this.createQueryBuilder('feedback')
      .leftJoinAndSelect('feedback.user', 'user')
      .where('feedback.volunteerRequestId = :volunteerRequestId', { volunteerRequestId });

    if (userId) {
      qb.andWhere('feedback.userId = :userId', { userId });
    }

    const data = await qb.getMany();
    return data;
  }
});
