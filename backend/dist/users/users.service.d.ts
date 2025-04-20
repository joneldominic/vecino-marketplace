import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { RedisService } from '../database/redis/redis.service';
export declare class UsersService {
  private userModel;
  private redisService;
  constructor(userModel: Model<User>, redisService: RedisService);
  findAll(): Promise<User[]>;
  findOne(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(userData: Partial<User>): Promise<User>;
  update(id: string, userData: Partial<User>): Promise<User | null>;
  remove(id: string): Promise<User | null>;
}
