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
      return request(app.getHttpServer()).get('/api/user').expect(200);
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
  });
});
