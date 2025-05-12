import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

import { CreateUserDto } from './dto/create-user.dto';
describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  const mockUsers: Partial<User>[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password',
    },
    {
      id: '2',
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
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
      findUnique: jest.fn().mockImplementation(({ where }) => {
        if (where.email) {
          return Promise.resolve(
            mockUsers.find((user) => user.email === where.email),
          );
        }
        if (where.id) {
          return Promise.resolve(
            mockUsers.find((user) => user.id === where.id),
          );
        }
        return Promise.resolve(null);
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

  describe('Fetch User', () => {
    it('should return a list of users', async () => {
      const result = await service.fetchAllUsers();
      expect(result).toEqual(mockUsers);
      expect(prisma.user.findMany).toHaveBeenCalled();
    });

    it('should return a user by his id', async () => {
      const result = await service.fetchUser('1');
      expect(result).toEqual(mockUsers[0]);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });

  describe('Create User', () => {
    it('should create a new user', async () => {
      const newUser: CreateUserDto = {
        id: '3',
        name: 'John Smith',
        email: 'smith.john@example.com',
        password: 'password',
      };

      prismaMock.user.create.mockResolvedValue(newUser);

      const result = await service.createUser(newUser);

      expect(prisma.user.create).toHaveBeenCalledWith({ data: newUser });
      expect(result).toEqual(newUser);
      expect(mockUsers.length).toBe(2);
    });

    // it('should throw a conflict exception when email already exists', async () => {
    //   const newUser: CreateUserDto = {
    //     id: '3',
    //     name: 'John Smith',
    //     email: 'john.doe@example.com',
    //     password: 'password',
    //   };

    //   prismaMock.user.findUnique.mockImplementation(({ where }) => {
    //     if (where.email === 'john.doe@example.com') {
    //       return Promise.resolve(newUser);
    //     }
    //     return Promise.resolve(null);
    //   });

    //   await expect(service.createUser(newUser)).rejects.toThrow(
    //     'User with this email already exists',
    //   );

    //   expect(prismaMock.user.create).not.toHaveBeenCalled();
    // });
  });
});
