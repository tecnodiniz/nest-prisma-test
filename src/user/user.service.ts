import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async fetchAllUsers() {
    return this.prisma.user.findMany();
  }

  async fetchUser(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
