import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  const mockUsers: Partial<User>[] = [
    {
      id: '1',
      name: 'Eduardo Diniz',
      email: 'diniz480@outlook.com',
      password: 'password',
    },
    {
      id: '2',
      name: 'Henrique Pereira',
      email: 'diniz480@gmail.com',
      password: 'password',
    },
  ];

  const prismaMock = {
    user: {
      findMany: jest.fn().mockResolvedValue(mockUsers),
      findUnique: jest.fn().mockImplementation(({ where: { id } }) => {
        return Promise.resolve(mockUsers.find((user) => user.id === id));
      }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a list of users', async () => {
    const result = await service.fetchAllUsers();
    expect(result).toEqual(mockUsers);
    expect(prisma.user.findMany).toHaveBeenCalled();
  });

  it('should return a user by his id', async () => {
    const result = await service.fetchUser('1');
    expect(result).toEqual(mockUsers[0]);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
  });
});
