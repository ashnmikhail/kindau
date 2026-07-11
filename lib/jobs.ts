// lib/jobs.ts

export type Job = {
  id: string;
  category: string;
  categoryName: string;
  title: string;
  description: string;
  metroPrice: number;
  regionalPrice: number;
};

export const JOBS: Job[] = [
  /* ------------------------------------------------------------
     1. ELECTRICAL
  ------------------------------------------------------------ */
  {
    id: "electrical-replace-light-switch",
    category: "electrical",
    categoryName: "Electrical",
    title: "Replace light switch",
    description: "Swap an existing light switch for a new one in the same position.",
    metroPrice: 120,
    regionalPrice: 140
  },
  {
    id: "electrical-install-powerpoint",
    category: "electrical",
    categoryName: "Electrical",
    title: "Install new power point",
    description: "Add a new double power point to an existing circuit.",
    metroPrice: 180,
    regionalPrice: 210
  },
  {
    id: "electrical-replace-downlight",
    category: "electrical",
    categoryName: "Electrical",
    title: "Replace downlight",
    description: "Swap an existing downlight for a new LED unit.",
    metroPrice: 110,
    regionalPrice: 130
  },
  {
    id: "electrical-install-ceiling-fan",
    category: "electrical",
    categoryName: "Electrical",
    title: "Install ceiling fan",
    description: "Install a new ceiling fan with existing wiring.",
    metroPrice: 220,
    regionalPrice: 260
  },
  {
    id: "electrical-replace-ceiling-fan",
    category: "electrical",
    categoryName: "Electrical",
    title: "Replace ceiling fan",
    description: "Remove an old fan and install a new one in the same location.",
    metroPrice: 180,
    regionalPrice: 210
  },
  {
    id: "electrical-install-oven",
    category: "electrical",
    categoryName: "Electrical",
    title: "Install electric oven",
    description: "Connect and secure a new electric oven to existing wiring.",
    metroPrice: 200,
    regionalPrice: 240
  },
  {
    id: "electrical-install-cooktop",
    category: "electrical",
    categoryName: "Electrical",
    title: "Install electric cooktop",
    description: "Install and connect a new electric cooktop.",
    metroPrice: 220,
    regionalPrice: 260
  },
  {
    id: "electrical-switchboard-safety-check",
    category: "electrical",
    categoryName: "Electrical",
    title: "Switchboard safety check",
    description: "Inspection of switchboard, breakers, and safety switches.",
    metroPrice: 150,
    regionalPrice: 180
  },
  {
    id: "electrical-replace-smoke-alarm",
    category: "electrical",
    categoryName: "Electrical",
    title: "Replace smoke alarm",
    description: "Replace an existing smoke alarm with a new unit.",
    metroPrice: 120,
    regionalPrice: 140
  },
  {
    id: "electrical-install-smoke-alarm",
    category: "electrical",
    categoryName: "Electrical",
    title: "Install new smoke alarm",
    description: "Install a new smoke alarm in a new location.",
    metroPrice: 150,
    regionalPrice: 180
  },
  {
    id: "electrical-fix-power-outlet",
    category: "electrical",
    categoryName: "Electrical",
    title: "Fix faulty power outlet",
    description: "Repair or replace a malfunctioning power outlet.",
    metroPrice: 140,
    regionalPrice: 170
  },
  {
    id: "electrical-replace-light-fitting",
    category: "electrical",
    categoryName: "Electrical",
    title: "Replace light fitting",
    description: "Replace an existing light fitting with a new one.",
    metroPrice: 130,
    regionalPrice: 160
  },
  {
    id: "electrical-install-exhaust-fan",
    category: "electrical",
    categoryName: "Electrical",
    title: "Install exhaust fan",
    description: "Install a bathroom or laundry exhaust fan.",
    metroPrice: 220,
    regionalPrice: 260
  },
  {
    id: "electrical-install-outdoor-light",
    category: "electrical",
    categoryName: "Electrical",
    title: "Install outdoor light",
    description: "Install a new outdoor light with existing wiring.",
    metroPrice: 160,
    regionalPrice: 190
  },
  {
    id: "electrical-replace-safety-switch",
    category: "electrical",
    categoryName: "Electrical",
    title: "Replace safety switch",
    description: "Replace a faulty RCD/safety switch in the switchboard.",
    metroPrice: 180,
    regionalPrice: 210
  },

  /* ------------------------------------------------------------
     2. PLUMBING
  ------------------------------------------------------------ */
  {
    id: "plumbing-fix-leaking-tap",
    category: "plumbing",
    categoryName: "Plumbing",
    title: "Fix leaking tap",
    description: "Repair a leaking tap with new washers or cartridges.",
    metroPrice: 140,
    regionalPrice: 160
  },
  {
    id: "plumbing-replace-tap",
    category: "plumbing",
    categoryName: "Plumbing",
    title: "Replace tap",
    description: "Remove an old tap and install a new one.",
    metroPrice: 160,
    regionalPrice: 190
  },
  {
    id: "plumbing-unblock-sink",
    category: "plumbing",
    categoryName: "Plumbing",
    title: "Unblock sink",
    description: "Clear a blocked kitchen or bathroom sink.",
    metroPrice: 180,
    regionalPrice: 210
  },
  {
    id: "plumbing-replace-toilet",
    category: "plumbing",
    categoryName: "Plumbing",
    title: "Replace toilet",
    description: "Remove an old toilet and install a new one.",
    metroPrice: 350,
    regionalPrice: 400
  },
  {
    id: "plumbing-fix-running-toilet",
    category: "plumbing",
    categoryName: "Plumbing",
    title: "Fix running toilet",
    description: "Repair cistern components causing continuous running.",
    metroPrice: 160,
    regionalPrice: 190
  },
  {
    id: "plumbing-install-dishwasher",
    category: "plumbing",
    categoryName: "Plumbing",
    title: "Install dishwasher",
    description: "Connect a new dishwasher to existing plumbing.",
    metroPrice: 180,
    regionalPrice: 210
  },
  {
    id: "plumbing-install-washing-machine",
    category: "plumbing",
    categoryName: "Plumbing",
    title: "Install washing machine",
    description: "Connect a washing machine to existing taps and drainage.",
    metroPrice: 140,
    regionalPrice: 160
  },
  {
    id: "plumbing-replace-shower-head",
    category: "plumbing",
    categoryName: "Plumbing",
    title: "Replace shower head",
    description: "Install a new shower head in place of an old one.",
    metroPrice: 120,
    regionalPrice: 140
  },
  {
    id: "plumbing-fix-burst-pipe",
    category: "plumbing",
    categoryName: "Plumbing",
    title: "Fix burst pipe",
    description: "Repair a burst or leaking pipe section.",
    metroPrice: 260,
    regionalPrice: 300
  },
  {
    id: "plumbing-install-vanity",
    category: "plumbing",
    categoryName: "Plumbing",
    title: "Install vanity",
    description: "Install a new bathroom vanity and reconnect plumbing.",
    metroPrice: 350,
    regionalPrice: 400
  },

  /* ------------------------------------------------------------
     3. PAINTING
  ------------------------------------------------------------ */
  {
    id: "painting-single-room",
    category: "painting",
    categoryName: "Painting",
    title: "Paint a single room",
    description: "Paint walls and ceiling of a standard bedroom or office.",
    metroPrice: 450,
    regionalPrice: 520
  },
  {
    id: "painting-feature-wall",
    category: "painting",
    categoryName: "Painting",
    title: "Paint feature wall",
    description: "Apply a feature colour to one wall.",
    metroPrice: 180,
    regionalPrice: 210
  },
  {
    id: "painting-door",
    category: "painting",
    categoryName: "Painting",
    title: "Paint internal door",
    description: "Sand and paint a standard internal door.",
    metroPrice: 120,
    regionalPrice: 140
  },
  {
    id: "painting-trim",
    category: "painting",
    categoryName: "Painting",
    title: "Paint skirting & trim",
    description: "Paint skirting boards, architraves, and trims.",
    metroPrice: 200,
    regionalPrice: 240
  },
  {
    id: "painting-ceiling",
    category: "painting",
    categoryName: "Painting",
    title: "Paint ceiling",
    description: "Paint a standard ceiling area.",
    metroPrice: 250,
    regionalPrice: 300
  },
  {
    id: "painting-exterior-door",
    category: "painting",
    categoryName: "Painting",
    title: "Paint exterior door",
    description: "Sand and paint an external door.",
    metroPrice: 180,
    regionalPrice: 210
  },
  {
    id: "painting-fence",
    category: "painting",
    categoryName: "Painting",
    title: "Paint fence",
    description: "Paint a standard timber fence section.",
    metroPrice: 350,
    regionalPrice: 400
  },

  /* ------------------------------------------------------------
     4. HANDYMAN
  ------------------------------------------------------------ */
  {
    id: "handyman-hang-tv",
    category: "handyman",
    categoryName: "Handyman",
    title: "Wall mount TV",
    description: "Mount a TV to the wall with a bracket (supplied by customer).",
    metroPrice: 180,
    regionalPrice: 210
  },
  {
    id: "handyman-assemble-furniture",
    category: "handyman",
    categoryName: "Handyman",
    title: "Assemble flat-pack furniture",
    description: "Assemble standard flat-pack furniture items.",
    metroPrice: 140,
    regionalPrice: 160
  },
  {
    id: "handyman-hang-pictures",
    category: "handyman",
    categoryName: "Handyman",
    title: "Hang pictures or mirrors",
    description: "Install picture hooks or mount mirrors securely.",
    metroPrice: 120,
    regionalPrice: 140
  },
  {
    id: "handyman-fix-door",
    category: "handyman",
    categoryName: "Handyman",
    title: "Fix sticking or squeaking door",
    description: "Adjust hinges, plane edges, or lubricate hardware.",
    metroPrice: 120,
    regionalPrice: 140
  },
  {
    id: "handyman-repair-hole-wall",
    category: "handyman",
    categoryName: "Handyman",
    title: "Repair small hole in wall",
    description: "Patch and sand a small hole in plasterboard.",
    metroPrice: 150,
    regionalPrice: 180
  },
  {
    id: "handyman-install-shelving",
    category: "handyman",
    categoryName: "Handyman",
    title: "Install shelving",
    description: "Mount shelves securely to the wall.",
    metroPrice: 160,
    regionalPrice: 190
  },

  /* ------------------------------------------------------------
     5. CARPENTRY
  ------------------------------------------------------------ */
  {
    id: "carpentry-replace-door",
    category: "carpentry",
    categoryName: "Carpentry",
    title: "Replace internal door",
    description: "Remove an old door and install a new one.",
    metroPrice: 220,
    regionalPrice: 260
  },
  {
    id: "carpentry-install-door-hardware",
    category: "carpentry",
    categoryName: "Carpentry",
    title: "Install door hardware",
    description: "Install new handles, locks, or latches.",
    metroPrice: 120,
    regionalPrice: 140
  },
  {
    id: "carpentry-repair-decking",
    category: "carpentry",
    categoryName: "Carpentry",
    title: "Repair decking boards",
    description: "Replace damaged decking boards.",
    metroPrice: 250,
    regionalPrice: 300
  },
  {
    id: "carpentry-install-skirting",
    category: "carpentry",
    categoryName: "Carpentry",
    title: "Install skirting boards",
    description: "Install new skirting boards in a room.",
    metroPrice: 200,
    regionalPrice: 240
  },
  {
    id: "carpentry-build-shelf",
    category: "carpentry",
    categoryName: "Carpentry",
    title: "Build custom shelf",
    description: "Build and install a custom timber shelf.",
    metroPrice: 260,
    regionalPrice: 300
  },

  /* ------------------------------------------------------------
     6. SECURITY INSTALLATION
  ------------------------------------------------------------ */
  {
    id: "security-install-camera",
    category: "security",
    categoryName: "Security Installation",
    title: "Install security camera",
    description: "Install a wired or wireless security camera.",
    metroPrice: 220,
    regionalPrice: 260
  },
  {
    id: "security-install-doorbell",
    category: "security",
    categoryName: "Security Installation",
    title: "Install video doorbell",
    description: "Install and configure a smart video doorbell.",
    metroPrice: 160,
    regionalPrice: 190
  },
  {
    id: "security-install-sensor-light",
    category: "security",
    categoryName: "Security Installation",
    title: "Install sensor light",
    description: "Install a motion‑activated outdoor sensor light.",
    metroPrice: 180,
    regionalPrice: 210
  },
  {
    id: "security-install-alarm-panel",
    category: "security",
    categoryName: "Security Installation",
    title: "Install alarm control panel",
    description: "Install and configure a home alarm control panel.",
    metroPrice: 260,
    regionalPrice: 300
  },
  {
    id: "security-install-window-sensors",
    category: "security",
    categoryName: "Security Installation",
    title: "Install window sensors",
    description: "Install magnetic sensors on windows.",
    metroPrice: 180,
    regionalPrice: 210
  },

  /* ------------------------------------------------------------
     7. REMOVALISTS
  ------------------------------------------------------------ */
  {
    id: "removalists-small-move",
    category: "removalists",
    categoryName: "Removalists",
    title: "Small apartment move",
    description: "Move items from a small apartment to another location.",
    metroPrice: 350,
    regionalPrice: 400
  },
  {
    id: "removalists-single-item",
    category: "removalists",
    categoryName: "Removalists",
    title: "Move single large item",
    description: "Move one large item such as a fridge or sofa.",
    metroPrice: 180,
    regionalPrice: 210
  },
  {
    id: "removalists-delivery",
    category: "removalists",
    categoryName: "Removalists",
    title: "Pickup & delivery",
    description: "Pickup and deliver furniture or appliances.",
    metroPrice: 220,
    regionalPrice: 260
  },
  {
    id: "removalists-disposal",
    category: "removalists",
    categoryName: "Removalists",
    title: "Furniture disposal",
    description: "Remove and dispose of unwanted furniture.",
    metroPrice: 200,
    regionalPrice: 240
  },

  /* ------------------------------------------------------------
     8. GARDENING
  ------------------------------------------------------------ */
  {
    id: "gardening-mow-lawn",
    category: "gardening",
    categoryName: "Gardening",
    title: "Mow lawn",
    description: "Mow a standard residential lawn.",
    metroPrice: 120,
    regionalPrice: 140
  },
  {
    id: "gardening-hedge-trim",
    category: "gardening",
    categoryName: "Gardening",
    title: "Trim hedges",
    description: "Trim and shape hedges up to 2m high.",
    metroPrice: 160,
    regionalPrice: 190
  },
  {
    id: "gardening-garden-cleanup",
    category: "gardening",
    categoryName: "Gardening",
    title: "Garden clean‑up",
    description: "General tidy‑up including weeding and debris removal.",
    metroPrice: 220,
    regionalPrice: 260
  },
  {
    id: "gardening-green-waste",
    category: "gardening",
    categoryName: "Gardening",
    title: "Green waste removal",
    description: "Remove and dispose of green waste.",
    metroPrice: 180,
    regionalPrice: 210
  },
  {
    id: "gardening-planting",
    category: "gardening",
    categoryName: "Gardening",
    title: "Plant new plants",
    description: "Plant new shrubs, flowers, or small trees.",
    metroPrice: 160,
    regionalPrice: 190
  }
];
