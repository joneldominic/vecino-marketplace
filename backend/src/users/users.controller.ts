import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  @Post()
  async create(@Body() userData: Partial<User>): Promise<User> {
    return this.usersService.create(userData);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() userData: Partial<User>): Promise<User> {
    const updatedUser = await this.usersService.update(id, userData);
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<User> {
    const deletedUser = await this.usersService.remove(id);
    if (!deletedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return deletedUser;
  }
}
