import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = [
    {
      name: 'John Doe',
      mobile: '121121121',
      avatarUrl: 'https://i.pravatar.cc/200',
    },
    {
      name: 'Jane Smith',
      mobile: '122122122',
      avatarUrl: 'https://i.pravatar.cc/200',
    },
    {
      name: 'Bob Johnson',
      mobile: '123123123',
      avatarUrl: 'https://i.pravatar.cc/200',
    },
    {
      name: 'Alice Lee',
      mobile: '124124124',
      avatarUrl: 'https://i.pravatar.cc/200',
    },
    {
      name: 'Mike Brown',
      mobile: '125125125',
      avatarUrl: 'https://i.pravatar.cc/200',
    },
  ];

  for (const user of users) {
    await prisma.user.create({ data: user });
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
