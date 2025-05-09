import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { userIdDTO } from './dto/id-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get()
  getUsers() {
    return this.service.fetchAllUsers();
  }

  @Get(':id')
  getUser(@Param() params: userIdDTO) {
    const { id } = params;
    return this.service.fetchUser(id);
  }
}
