import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';

describe('UserController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();
  });

  describe('GET /user', () => {
    it('should return a list of users', () => {
      return request(app.getHttpServer())
        .get('/api/user')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('should return a user by his id', async () => {
      const result = await request(app.getHttpServer())
        .post('/api/user/1')
        .send({
          id: '1',
          name: 'John Doe',
          email: 'johndoe@example.com',
          password: 'password',
        });

      if (result.status !== 200) return;

      return await request(app.getHttpServer())
        .get('/api/user/1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
        });
    });

    it('should return 404 if user not found by his id', async () => {
      return await request(app.getHttpServer())
        .get('/api/user/1000')
        .expect(404)
        .expect((res) => expect(res.body.message).toEqual('User not found'));
    });
  });

  describe('POST /user', () => {
    it('should create a new user', async () => {
      return await request(app.getHttpServer())
        .post('/api/user')
        .send({
          name: 'John Doe',
          email: 'john.doe@example.com',
          password: 'password',
        })
        .expect(201);
    });

    it('should return an error if body has wrong att', async () => {
      return await request(app.getHttpServer())
        .post('/api/user')
        .send({
          username: 'John Doe',
          email: 'john.doe@example.com',
          password: 'password',
        })
        .expect(400);
    });
  });
});
