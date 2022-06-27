import { User } from '../models';
import { dataSource } from '../server/initialize-db';

export const UserRepository = dataSource.getRepository(User).extend({
  findByEmail(email: string): Promise<User | null> {
    return this.findOne({ where: { email } });
  }
});
