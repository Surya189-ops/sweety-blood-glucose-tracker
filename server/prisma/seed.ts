import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'demo@sweety.app';
  const password = 'SweetyDemo123!';
  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name: 'Sweety Demo',
      password: passwordHash,
    },
    create: {
      name: 'Sweety Demo',
      email,
      password: passwordHash,
    },
  });

  await prisma.glucoseReading.deleteMany({
    where: { userId: user.id },
  });

  const today = new Date();
  const date = new Date(Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate(),
  ));

  await prisma.glucoseReading.createMany({
    data: [
      { userId: user.id, date, slot: 'MORNING', value: 105 },
      { userId: user.id, date, slot: 'AFTER_BREAKFAST', value: 132 },
      { userId: user.id, date, slot: 'AFTER_LUNCH', value: 145 },
      { userId: user.id, date, slot: 'AFTER_DINNER', value: 120 },
    ],
  });

  console.log('Demo account created successfully.');
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
  console.log('Created four sample glucose readings.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
