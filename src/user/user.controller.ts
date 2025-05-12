import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { userIdDTO } from './dto/id-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get()
  async getUsers() {
    return await this.service.fetchAllUsers();
  }

  @Get(':id')
  async getUser(@Param() params: userIdDTO) {
    const { id } = params;
    return await this.service.fetchUser(id);
  }

  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    return await this.service.createUser(dto);
  }
}
