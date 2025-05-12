import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: CreateUserDto) {
    const { email } = data;
    const emailExist = await this.prisma.user.findUnique({ where: { email } });

    if (emailExist) {
      throw new ConflictException('User with this email already exists');
    }
    return await this.prisma.user.create({ data });
  }

  async fetchAllUsers() {
    return await this.prisma.user.findMany();
  }

  async fetchUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
