import { PrismaClient, User } from '@prisma/client';
import { faker } from '@faker-js/faker';

import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const users: Partial<User>[] = [];

  for (let i = 0; i < 10; i++) {
    const plainPassword = faker.internet.password();
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    users.push({
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: hashedPassword,
    });
  }

  await prisma.user.createMany({
    data: users,
    skipDuplicates: true,
  });
  console.log('✅ Seed: 10 users have been created!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
