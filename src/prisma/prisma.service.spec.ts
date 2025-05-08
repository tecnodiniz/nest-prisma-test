import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    prisma = module.get<PrismaService>(PrismaService);
    await prisma.$connect();
  });

  it('should connect to the database and run a simple query', async () => {
    // Altere para o modelo que você tiver no seu schema.prisma
    const users = await prisma.users.findMany();
    expect(Array.isArray(users)).toBe(true);
  });
});
