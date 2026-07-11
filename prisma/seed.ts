import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// Explicit tuple type so TS knows: [string, number]
type SubSeed = [string, number]

async function main() {
  console.log('🌱 Seeding database with categories, subcategories, and pricing...')

  const data: { name: string; subs: SubSeed[] }[] = [
    {
      name: 'Electrical',
      subs: [
        ['Powerpoints', 160],
        ['Lighting', 130],
        ['Switchboards', 1055],
        ['Fault Finding', 160],
        ['Ceiling Fan Installation', 150],
        ['Smoke Alarm Installation', 120],
        ['Oven / Cooktop Installation', 195],
        ['EV Charger Installation', 1320],
        ['Safety Switch (RCD) Installation', 220],
        ['Minor Rewiring', 310],
        ['Outdoor Lighting', 195],
        ['Data Cabling / NBN', 160],
        ['TV Wall Mount + Powerpoint', 230],
        ['Appliance Installation (Electrical)', 140],
      ],
    },
    {
      name: 'Plumbing',
      subs: [
        ['Blocked Drains', 265],
        ['Hot Water Systems', 1320],
        ['Leaks', 195],
        ['Toilets', 220],
        ['Tap Replacement', 130],
        ['Burst Pipes', 310],
        ['Shower Repairs', 245],
        ['Gas Fitting', 310],
        ['Dishwasher Installation', 160],
        ['Vanity Installation', 395],
        ['Stormwater Issues', 350],
        ['Roof Plumbing', 335],
        ['Water Filter Installation', 175],
        ['Bathroom Plumbing (Minor)', 265],
      ],
    },
    {
      name: 'Carpentry',
      subs: [
        ['Doors', 195],
        ['Decking', 2640],
        ['Framing', 1760],
        ['Cabinetry', 1320],
        ['Skirting & Architraves', 310],
        ['Door Repairs / Hanging', 160],
        ['Window Frame Repairs', 265],
        ['Shelving Installation', 175],
        ['Wardrobe Installation', 700],
        ['Timber Flooring Repairs', 395],
        ['Pergolas', 3520],
        ['Fencing (Timber)', 2200],
        ['Gate Installation', 310],
        ['Small Carpentry Repairs', 160],
      ],
    },
    {
      name: 'Painter',
      subs: [
        ['Interior Painting (Single Room)', 530],
        ['Interior Painting (Whole Home)', 3520],
        ['Exterior Painting', 4400],
        ['Fence Painting', 700],
        ['Deck Staining / Oiling', 395],
        ['Ceiling Painting', 310],
        ['Door Painting', 130],
        ['Window Frame Painting', 175],
        ['Patch & Paint', 160],
        ['Feature Wall Painting', 265],
        ['Garage Floor Epoxy', 1055],
        ['Touch-ups / Small Jobs', 130],
      ],
    },
    {
      name: 'Handyman',
      subs: [
        ['General Repairs', 130],
        ['Furniture Assembly', 105],
        ['Flatpack Assembly', 105],
        ['TV Mounting', 160],
        ['Curtain / Blind Installation', 130],
        ['Patch & Paint (Minor Repairs)', 160],
        ['Door Handle / Lock Fixes', 120],
        ['Small Wall Repairs', 175],
        ['Hanging Pictures / Mirrors', 105],
        ['Shelving Installation', 160],
        ['Minor Carpentry Repairs', 160],
        ['Gate Repairs', 175],
        ['Flyscreen Replacement', 105],
        ['Weather Stripping / Draft Fixing', 130],
      ],
    },
    {
      name: 'Air Conditioning / HVAC',
      subs: [
        ['Split System Installation', 790],
        ['Split System Removal', 265],
        ['Split System Service', 175],
        ['Ducted System Service', 395],
        ['AC Cleaning', 160],
        ['AC Gas Refill', 220],
        ['Thermostat Installation', 175],
        ['AC Fault Diagnosis', 160],
        ['Outdoor Unit Relocation', 440],
        ['AC Electrical Isolation Switch Installation', 220],
      ],
    },
    {
      name: 'Roofing',
      subs: [
        ['Roof Leak Repairs', 350],
        ['Gutter Cleaning', 220],
        ['Gutter Replacement', 1055],
        ['Downpipe Installation', 310],
        ['Roof Tile Repairs', 265],
        ['Flashing Repairs', 310],
        ['Ridge Capping Repairs', 700],
        ['Roof Vent Installation', 310],
        ['Metal Roof Repairs', 530],
        ['Storm Damage Repairs', 880],
      ],
    },
  ]

  for (const cat of data) {
    const created = await prisma.category.create({
      data: {
        name: cat.name,
        subcategories: {
          create: cat.subs.map(([name, price]) => ({
            name,
            price,
          })),
        },
      },
    })

    console.log(`Created category: ${created.name}`)
  }

  console.log('🌱 Pricing seed complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
