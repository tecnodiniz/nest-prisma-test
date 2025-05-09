import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: Partial<User>) {
    return this.prisma.user.create({ data });
  }
  async fetchAllUsers() {
    return this.prisma.user.findMany();
  }

  async fetchUser(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
