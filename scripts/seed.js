const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const permissions = [
  {
    name: 'Company Command',
    required_hours: 100,
    questions: [
      {
        text: 'How many strikes will cause you to lose permissions for Company Commander?',
        options: ['4', '2', '3'],
        correct_answer: '2',
      },
      {
        text: 'True or False: Company Commander is permitted to operate outside of a FOB or Operations Base?',
        options: ['True', 'False'],
        correct_answer: 'True',
      },
      {
        text: 'True or False: Company Commander should have complete knowledge of ALL Standard Operating Procedures?',
        options: ['True', 'False'],
        correct_answer: 'True',
      },
      {
        text: 'Which Frequencies are you required to monitor as Company Command?',
        options: ['LR 031.000 & SR 160.000', 'LR 080.000 & SR 070.000', 'LR 030.000 & SR 036.000'],
        correct_answer: 'LR 030.000 & SR 036.000',
      },
      {
        text: 'What takes priority for building assets?',
        options: ['Armor', 'Transport', 'Air CAS'],
        correct_answer: 'Transport',
      },
      {
        text: 'Who has authority over Armored assets?',
        options: ['Platoon Leaders', 'Company Command', 'Squad Leaders'],
        correct_answer: 'Platoon Leaders',
      },
      {
        text: 'What frequency is used to contact Platoon JFOs for requests?',
        options: ['LR 031.000', 'LR 080.000', 'LR 040.000'],
        correct_answer: 'LR 080.000',
      },
      {
        text: 'True or False: Assassin 6-6 can give direct orders to Assassin squads.',
        options: ['True', 'False'],
        correct_answer: 'False',
      },
      {
        text: 'How many Shade crew members are required to operate mortars outside of a FOB?',
        options: ['1', '2', '3'],
        correct_answer: '2',
      },
      {
        text: 'Are you permitted to fly the MQ-9 Reaper drone?',
        options: ['Yes', 'No'],
        correct_answer: 'No',
      },
      {
        text: 'Can you authorize danger close fire missions?',
        options: ['Yes', 'No'],
        correct_answer: 'No',
      },
    ],
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
    asset_exam: true,
  },
  {
    name: 'Butcher',
    required_hours: 50,
    asset_exam: true,
  },
  {
    name: 'Phantom',
    required_hours: 50,
    prerequisites: ['Company Command', 'Platoon TACP'],
    asset_exam: true,
  },
  {
    name: 'Rotary Logistics',
    required_hours: 50,
    asset_exam: true,
  },
  {
    name: 'Rotary CAS',
    required_hours: 50,
    prerequisites: ['Rotary Logistics'],
    asset_exam: true,
  },
  {
    name: 'Fixed Wing CAS',
    required_hours: 50,
    prerequisites: ['Rotary Logistics'],
    asset_exam: true,
  },
];

async function main() {
  console.log('Deleting all permissions...');
  try {
    await prisma.question.deleteMany();
    await prisma.permission.deleteMany();
    console.log('Permissions deleted');
  } catch (error) {
    console.error(error);
  }

  console.log('Seeding permissions...');
  for (const permission of permissions) {
    const permData = {
      name: permission.name,
      required_hours: permission.required_hours,
      prerequisites: permission.prerequisites || [],
      asset_exam: permission.asset_exam || false,
      questions: permission.questions
        ? {
            create: permission.questions.map((question) => ({
              text: question.text,
              options: question.options,
              correct_answer: question.correct_answer,
            })),
          }
        : undefined,
    };

    try {
      await prisma.permission.create({
        data: permData,
      });
      console.log(`Permission ${permission.name} seeded`);
    } catch (error) {
      console.error(`Error seeding permission ${permission.name}:`, error);
    }
  }
}

main()
  .then(() => {
    console.log('\n\nDatabase has been seeded with permissions!!\n');
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
