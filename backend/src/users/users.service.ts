import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserRole } from './schemas/user.schema';
import { RedisService } from '../database/redis/redis.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private redisService: RedisService,
  ) {}

  async findAll(): Promise<User[]> {
    // Try to get from cache first
    const cachedUsers = await this.redisService.get<User[]>('all_users');
    
    if (cachedUsers) {
      return cachedUsers;
    }
    
    // If not in cache, get from database
    const users = await this.userModel.find().exec();
    
    // Store in cache for 5 minutes
    await this.redisService.set('all_users', users, 300);
    
    return users;
  }

  async findOne(id: string): Promise<User | null> {
    // Try to get from cache first
    const cacheKey = `user_${id}`;
    const cachedUser = await this.redisService.get<User>(cacheKey);
    
    if (cachedUser) {
      return cachedUser;
    }
    
    // If not in cache, get from database
    const user = await this.userModel.findById(id).exec();
    
    if (user) {
      // Store in cache for 5 minutes
      await this.redisService.set(cacheKey, user, 300);
    }
    
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async create(userData: Partial<User>): Promise<User> {
    const newUser = new this.userModel(userData);
    const savedUser = await newUser.save();
    
    // Invalidate the all_users cache
    await this.redisService.delete('all_users');
    
    return savedUser;
  }

  async update(id: string, userData: Partial<User>): Promise<User | null> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, userData, { new: true })
      .exec();
    
    if (updatedUser) {
      // Update the cache
      const cacheKey = `user_${id}`;
      await this.redisService.set(cacheKey, updatedUser, 300);
      
      // Invalidate the all_users cache
      await this.redisService.delete('all_users');
    }
    
    return updatedUser;
  }

  async remove(id: string): Promise<User | null> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    
    if (deletedUser) {
      // Remove from cache
      const cacheKey = `user_${id}`;
      await this.redisService.delete(cacheKey);
      
      // Invalidate the all_users cache
      await this.redisService.delete('all_users');
    }
    
    return deletedUser;
  }
} 