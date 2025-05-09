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
      create: jest
        .fn()
        .mockImplementation(({ data: { id, name, email, password } }) => {
          const newUser = { id, name, email, password };
          mockUsers.push(newUser);
          return Promise.resolve(newUser);
        }),
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

  it('should create a new user', async () => {
    const newUser: Partial<User> = {
      id: '3',
      name: 'Henrique Eduardo',
      email: 'diniz@yahoo.com',
      password: 'password',
    };

    prismaMock.user.create.mockResolvedValue(newUser);

    const result = await service.createUser(newUser);

    expect(prisma.user.create).toHaveBeenCalledWith({ data: newUser });
    expect(result).toEqual(newUser);
    expect(mockUsers.length).toBe(2);
  });
});
