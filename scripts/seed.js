// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const permissions = [
  {
    name: 'Company Command',
    required_hours: 100,
    questions: [
      {
        text: 'How many strikes will cause you to lose permissions for Company Commander?',
        type: 'MULTIPLE_CHOICE',
        options: ['4', '2', '3'],
        correct_answer: '2',
      },
      {
        text: 'True or False: Company Commander is permitted to operate outside of a FOB or Operations Base?',
        type: 'TRUE_FALSE',
        correct_answer: 'True',
      },
      {
        text: 'True or False: Company Commander should have complete knowledge of ALL Standard Operating Procedures?',
        type: 'TRUE_FALSE',
        correct_answer: 'True',
      },
      {
        text: 'Which Frequencies are you required to monitor as Company Command?',
        type: 'MULTIPLE_CHOICE',
        options: ['LR 031.000 & SR 160.000', 'LR 080.000 & SR 070.000', 'LR 030.000 & SR 036.000'],
        correct_answer: 'LR 030.000 & SR 036.000',
      },
      {
        text: 'What takes priority for building assets?',
        type: 'MULTIPLE_CHOICE',
        options: ['Armor', 'Transport', 'Air CAS'],
        correct_answer: 'Transport',
      },
      {
        text: 'Who has authority over Armored assets?',
        type: 'MULTIPLE_CHOICE',
        options: ['Platoon Leaders', 'Company Command', 'Squad Leaders'],
        correct_answer: 'Platoon Leaders',
      },
      {
        text: 'What frequency is used to contact Platoon JFOs for requests?',
        type: 'MULTIPLE_CHOICE',
        options: ['LR 031.000', 'LR 080.000', 'LR 040.000'],
        correct_answer: 'LR 080.000',
      },
      {
        text: 'True or False: Assassin 6-6 can give direct orders to Assassin squads.',
        type: 'TRUE_FALSE',
        correct_answer: 'False',
      },
      {
        text: 'How many Shade crew members are required to operate mortars outside of a FOB?',
        type: 'MULTIPLE_CHOICE',
        options: ['1', '2', '3'],
        correct_answer: '2',
      },
      {
        text: 'True of False: Company Commander is permitted to fly the MQ-9 Reaper drone?',
        type: 'TRUE_FALSE',
        correct_answer: 'False',
      },
      {
        text: 'True or False: Comany Commander authorize danger close fire missions?',
        type: 'TRUE_FALSE',
        correct_answer: 'False',
      },
    ],
  },
  {
    name: 'Platoon Leader',
    required_hours: 100,
    questions: [
      {
        text: 'How many strikes will cause you to lose permissions for Platoon Leader?',
        type: 'MULTIPLE_CHOICE',
        options: ['4', '3', '2'],
        correct_answer: '2',
      },
      {
        text: 'True or False: As Platoon Leader are you authorized to operate an Armored asset if you have perms?',
        type: 'TRUE_FALSE',
        correct_answer: 'False',
      },
      {
        text: 'What frequencies are you required to monitor as Platoon Leader?',
        type: 'MULTIPLE_CHOICE',
        options: [
          'LR 080.000, LR 031.000 & SR 160.000',
          'LR 030.000, LR 031.000 & SR 160.000',
          'LR 080.000, LR 081.000 & SR 070.000',
        ],
        correct_answer: 'LR 030.000, LR 031.000 & SR 160.000',
      },
      {
        text: 'Who can authorize danger close fire missions?',
        type: 'MULTIPLE_CHOICE',
        options: ['Assassin 6-6', 'Platoon Leaders', 'Squad Leaders', 'TACP'],
        correct_answer: 'Platoon Leader',
      },
      {
        text: 'True or False: Platoon Leaders are allowed to be on the front lines LEADING assaults?',
        type: 'TRUE_FALSE',
        correct_answer: 'False',
      },
      {
        text: 'Who has direct command over Butcher?',
        type: 'MULTIPLE_CHOICE',
        options: ['Platoon Leaders', 'Company Command', 'Both'],
        correct_answer: 'Platoon Leaders',
      },
      {
        text: '1st Platoon is assaulting a civilian OPFOR sector, 6-6 radios that a battlegroup has been spotted heading for a BLUFOR sector 3,000m away and orders all of 1st Platoon to fall back immediately to safe LZ marked on map for extraction and new tasking is to stop the battlegroup. Do you follow 6-6 orders, or try to capture the OPFOR sector?',
        type: 'MULTIPLE_CHOICE',
        options: ['No, continue assaulting the civilian OPFOR sector', 'Yes, follow 6-6 orders.'],
        correct_answer: 'Yes, follow 6-6 orders.',
      },
      {
        text: 'True or False: OGRE is a direct combat unit',
        type: 'TRUE_FALSE',
        correct_answer: 'False',
      },
      {
        text: 'What is the purpose of Banshee?',
        type: 'MULTIPLE_CHOICE',
        options: [
          'QRF response team',
          'Tactical Air Control Party',
          'Quick reaction medical response team',
        ],
        correct_answer: 'Quick reaction medical response team',
      },
      {
        text: 'At what range is danger close approval needed for using HE.',
        type: 'MULTIPLE_CHOICE',
        options: ['300m', '400m', '200m'],
        correct_answer: '200m',
      },
      {
        text: " What is Stalker's main priorities?",
        type: 'MULTIPLE_CHOICE',
        options: ['Close Air Support', 'Indirect fire', 'Supply logistics & inserting infantry'],
        correct_answer: 'Supply logistics & inserting infantry',
      },
      {
        text: 'What does the abbreviation (OP) stand for?',
        type: 'MULTIPLE_CHOICE',
        options: ['Observation Post', 'Original Position', 'Origin Point'],
        correct_answer: 'Observation Post',
      },
      {
        text: 'What does the abbreviation (RP) stand for?',
        type: 'MULTIPLE_CHOICE',
        options: ['Refuel Point', 'Radio Position', 'Rally Point'],
        correct_answer: 'Rally Point',
      },
      {
        text: 'Select the option that shows the sector threat levels from highest to lowest.',
        type: 'MULTIPLE_CHOICE',
        options: [
          'Military, Radio, Capital, Factory, Town',
          'Town, Factory, Military, Radio, Capital',
          'Capital, Military, Radio, Factory, Town',
        ],
        correct_answer: 'Capital, Military, Radio, Factory, Town',
      },
      {
        text: 'Name & IFF',
        image_url: 'https://i.imgur.com/pY1mr4J.jpeg',
        type: 'MULTIPLE_CHOICE',
        options: ['M1A2 Abrams Foe', 'T-72 Foe', 'BMD- Foe'],
        correct_answer: 'T-72 Foe',
      },
      {
        text: 'Name & IFF',
        image_url: 'https://i.imgur.com/subB6fl.jpeg',
        type: 'MULTIPLE_CHOICE',
        options: ['ZSu-Shilka Foe', 'Ural-Zu Foe', 'BMP- Foe'],
        correct_answer: 'ZSu-Shilka Foe',
      },
      {
        text: 'M1126 Stryker Foe',
        image_url: 'https://i.imgur.com/XjUdk7b.jpeg',
        type: 'MULTIPLE_CHOICE',
        options: ['M1126 Stryker Foe', 'BTR Foe', 'BMD Foe'],
        correct_answer: 'BTR Foe',
      },
    ],
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
    await prisma.application.deleteMany();
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
    };

    try {
      const createdPermission = await prisma.permission.create({
        data: permData,
      });

      if (permission.questions) {
        for (const question of permission.questions) {
          const questionData = {
            text: question.text,
            type: question.type,
            image_url: question.image_url || null,
            permission_id: createdPermission.id,
            question_data: {},
          };

          switch (question.type) {
            case 'MULTIPLE_CHOICE':
            case 'MULTIPLE_SELECT':
              questionData.question_data = {
                options: question.options,
                correct_answer: question.correct_answer,
              };
              break;
            case 'TRUE_FALSE':
              questionData.question_data = {
                correct_answer: question.correct_answer,
              };
              break;
          }

          await prisma.question.create({
            data: questionData,
          });
        }
      }

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
