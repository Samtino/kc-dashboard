const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const permissions = [
  {
    name: 'Company Command',
    required_hours: 100,
  },
  {
    name: 'Platoon Leader',
    required_hours: 100,
  },
  {
    name: 'Platoon TACP',
    required_hours: 100,
  },
  {
    name: 'Platoon Medic',
    required_hours: 50,
  },
  {
    name: 'Squad Leader',
    required_hours: 50,
  },
  {
    name: 'Banshee',
    required_hours: 50,
    prerequisites: ['Platoon Medic'],
  },
  {
    name: 'Butcher',
    required_hours: 50,
  },
  {
    name: 'Phantom',
    required_hours: 50,
    prerequisites: ['Company Command', 'Platoon TACP'],
  },
  {
    name: 'Rotary Logistics',
    required_hours: 50,
  },
  {
    name: 'Rotary CAS',
    required_hours: 50,
    prerequisites: ['Rotary Logistics'],
  },
  {
    name: 'Fixed Wing CAS',
    required_hours: 50,
    prerequisites: ['Rotary Logistics'],
  },
];

async function main() {
  for (const permission of permissions) {
    await prisma.permission.create({
      data: permission,
    });
  }
}

main()
  .then(() => {
    console.log('Database has been seeded with permissions');
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
