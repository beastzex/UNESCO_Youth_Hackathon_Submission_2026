export interface CaseStudy {
  id: string;
  slug: string;
  number: string;
  sectionLabel: string;
  title: string; // Used in serif font on case study screen
  capsLabel: string; // e.g. "UTOPIA", "IN_COGNITA"
  oneLiner: string;
  category: string;
  year: string;
  client: string;
  location: string;
  colorGrade: string; // Color palette contained strictly within image/project boundary
  heroImage: string;
  gallery: string[];
  overview: string;
  challenge: string;
  solution: string;
  quote: {
    text: string;
    author: string;
  };
  metrics?: { label: string; value: string }[];
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "01",
    slug: "utopia",
    number: "01",
    sectionLabel: "Sensory Paradox",
    title: "Utopia",
    capsLabel: "UTOPIA",
    oneLiner: "Where taste meets meaning.",
    category: "Branding & Spatial Art Direction",
    year: "2025",
    client: "Maison Utopia",
    location: "Paris / Tokyo",
    colorGrade: "from-[#8A9A86] via-[#606E5D] to-[#2B3529]", // Sage Green palette
    heroImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
    ],
    overview: "Utopia required an identity that rejected the cliché minimal tropes of fine dining in favor of a sensory paradox: hyper-refined culinary heritage collided with synthetic metallic textures and sculptural typography.",
    challenge: "Translate an avant-garde multisensory dining concept into an editorial ecosystem that feels both ancient and digitally augmented.",
    solution: "We designed a bespoke typographic vernacular rooted in architectural geometry, paired with silver foil embossed menus, iridescent vacuum-sealed invitations, and generative spatial projections.",
    quote: {
      text: "Not just a restaurant, but an ethereal pause in perception.",
      author: "Sara Guedj, Creative Director"
    },
    metrics: [
      { label: "Press Features", value: "48+" },
      { label: "Guest Retention", value: "92%" }
    ]
  },
  {
    id: "02",
    slug: "in-cognita",
    number: "02",
    sectionLabel: "Impulsion",
    title: "in_cognita",
    capsLabel: "IN_COGNITA",
    oneLiner: "Seize the unexpected: the invisible, made visible.",
    category: "Editorial & Luxury Campaign",
    year: "2024",
    client: "In_Cognita Haute Parfumerie",
    location: "Milan / Paris",
    colorGrade: "from-[#C26747] via-[#853C27] to-[#3B1910]", // Warm terracotta / brown palette
    heroImage: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1600&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80"
    ],
    overview: "A luxury fragrance line built on synthetic olfactory memories. We crafted an enigmatic visual universe featuring chrome balloon monoliths, tactile iridescent wraps, and macro lens explorations.",
    challenge: "Illustrate intangible scent profiles without resorting to standard floral and botanical clichés.",
    solution: "Subversive tactile CGI elements: frosted chrome sculptures, liquid metallic droplets, and an audio-visual manifesto film premiered during Paris Fashion Week.",
    quote: {
      text: "They gave shape to our most invisible scent formulations.",
      author: "In_Cognita Olfactory Director"
    },
    metrics: [
      { label: "Impressions", value: "8.4M" },
      { label: "Edition Sellout", value: "48 Hours" }
    ]
  },
  {
    id: "03",
    slug: "aurbse",
    number: "03",
    sectionLabel: "Cartography",
    title: "Aurbse",
    capsLabel: "AURBSE",
    oneLiner: "A living instrument for reading territory.",
    category: "Digital Instrument & Generative AI",
    year: "2025",
    client: "Aurbse Geospatial Labs",
    location: "Zurich / Paris",
    colorGrade: "from-[#2A4365] via-[#1A202C] to-[#0D1117]", // Deep indigo & cobalt telemetry
    heroImage: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1600&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80"
    ],
    overview: "Aurbse transforms urban geographic telemetry into living kinetic sculptures and responsive brand systems for luxury architectural developments.",
    challenge: "Make complex geospatial datasets emotionally resonant for high-net-worth cultural patrons and urban strategists.",
    solution: "An interactive spatial interface rendered in real-time WebGL, driven by ambient city sensors, weather acoustics, and custom neural style synthesizers.",
    quote: {
      text: "Data without perspective is noise. With Nothin', it became poetry.",
      author: "Aurbse Core Research Group"
    },
    metrics: [
      { label: "Data Nodes", value: "1.2M" },
      { label: "WebGL Speed", value: "60 FPS" }
    ]
  },
  {
    id: "04",
    slug: "lgm",
    number: "04",
    sectionLabel: "Engineering",
    title: "LGM",
    capsLabel: "LGM",
    oneLiner: "Swiss clarity for French engineering.",
    category: "Visual Identity System & 3D",
    year: "2024",
    client: "LGM Technologies & Aerospace",
    location: "Geneva / Paris",
    colorGrade: "from-[#8E939B] via-[#4A4E57] to-[#1F232B]", // Cool gray metal
    heroImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80"
    ],
    overview: "Engineering systems distilled into mathematical purity. We bridged Swiss international typographic rigor with high-performance aerospace computing.",
    challenge: "Make complex engineering schematics and enterprise software feel effortlessly sharp, authoritative, and visionary.",
    solution: "A monochrome grid-bound graphic system with high-contrast mono typography, micro-engraved aluminium identity cards, and architectural brand manuals.",
    quote: {
      text: "Precision is not the absence of emotion; it is emotion concentrated.",
      author: "Guillaume Fayolle, Strategy Lead"
    },
    metrics: [
      { label: "Cohesion Score", value: "98/100" },
      { label: "Modular Assets", value: "340+" }
    ]
  },
  {
    id: "05",
    slug: "haptify",
    number: "05",
    sectionLabel: "Multisensory",
    title: "Haptify",
    capsLabel: "HAPTIFY",
    oneLiner: "Branding the forgotten sense.",
    category: "Tactile Design & Multisensory Interface",
    year: "2024",
    client: "Haptify Sensory Computing",
    location: "Paris / San Francisco",
    colorGrade: "from-[#E11D48] via-[#881337] to-[#0F0206]", // Black + Red Glow
    heroImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80"
    ],
    overview: "Haptify is a pioneering haptic-feedback technology venture. We gave tactile feeling a visual soul through inflatable chrome forms, textured embossed papers, and kinetic micro-interactions.",
    challenge: "Express the feeling of touch through flat digital screens and pristine packaging.",
    solution: "Deconstructed everyday textures: metallic bubble wrap, candy wrappers, and squishy latex geometries animated with physical bounce dynamics.",
    quote: {
      text: "You don't just look at Haptify; you physically sense its presence.",
      author: "Pierre Patrault, Creative Partner"
    },
    metrics: [
      { label: "Engagements", value: "3.8M" },
      { label: "Awwwards SOTD", value: "Winner" }
    ]
  }
];

export const TEAM_MANAGEMENT = [
  { name: "Sara Guedj", role: "Founder & Creative Director" },
  { name: "Anne-Sophie Do", role: "Managing Partner & Executive Producer" },
  { name: "Gabriel Guedj", role: "Strategic Development & Operations" },
  { name: "Guillaume Fayolle", role: "Brand Strategy & Narrative Architecture" }
];

export const CREATIVE_PARTNERS = [
  { name: "Pierre Patrault", role: "Creative Direction & Web Architecture" },
  { name: "Thomas Carré", role: "Interaction Design & Creative Code" },
  { name: "Guillaume Perrette", role: "3D Motion & Visual Synthetics" }
];

export const CAPABILITIES = [
  "Brand identities",
  "Campaigns & films",
  "Digital experiences",
  "Events & scenography",
  "Visual systems & AI"
];
