import { appDataSource } from '../dataSource';
import { User } from '../models';

export const userRepository = appDataSource.getRepository(User).extend({
  findByEmail(email: string): Promise<User | null> {
    return this.findOne({ where: { email } });
  }
});
