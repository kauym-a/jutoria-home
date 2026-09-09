export type Material = {
  id: string;
  slug: string;
  name: string;
  desc: string;
  longDesc: string;
  image: string;
};

// Our Materials — shared across the Home page grid, the /materials index page,
// and each /materials/:slug detail page. Edit here once, it updates everywhere.
export const materials: Material[] = [
  {
    id: '01',
    slug: 'jute',
    name: 'Natural Jute',
    desc: 'The golden fiber, known for its incredible strength, natural sheen, and rich, earthy texture.',
    longDesc: 'Jute is Bangladesh\'s signature natural fiber — the "golden fiber" that has shaped the country\'s export economy for generations. Grown in the fertile delta region, it is prized for its tensile strength, natural sheen and biodegradability. At Jutoria, jute forms the structural backbone of our placemats, floor coverings and storage baskets, hand-braided by artisans before being sewn into finished pieces.',
    image: '/materials/natural-jute.png',
  },
  {
    id: '02',
    slug: 'seagrass',
    name: 'Seagrass',
    desc: 'Woven into durable, flexible forms with a distinct natural tone and organic warmth.',
    longDesc: 'Seagrass is harvested from coastal wetlands and dried before weaving, giving it a smooth, slightly glossy finish and a naturally variegated tone. Its flexibility makes it ideal for rounded basket forms — planters, laundry baskets and organizers — while remaining sturdy enough for repeated daily use.',
    image: '/materials/seagrass.png',
  },
  {
    id: '03',
    slug: 'bamboo',
    name: 'Bamboo',
    desc: 'A fast-growing grass crafted into structured, lightweight, and enduring home accents.',
    longDesc: 'Bamboo is one of the fastest-renewing plants on earth, making it a genuinely sustainable material choice. We use it for structural framing and accent detailing, where its light weight and natural rigidity add durability without adding bulk.',
    image: '/materials/bamboo.png',
  },
  {
    id: '04',
    slug: 'hogla-leaf',
    name: 'Hogla Leaf',
    desc: 'A beautiful aquatic plant dried and intricately braided for soft, thick, and resilient textures.',
    longDesc: 'Hogla leaf grows wild along Bangladesh\'s waterways. Once dried, it is intricately braided into thick, soft-textured strands used for placemats and decorative pieces — a material with a distinctly regional character that is difficult to source outside Bangladesh.',
    image: '/materials/hogla-leaf.png',
  },
  {
    id: '05',
    slug: 'cane-rattan',
    name: 'Cane / Natural Rattan',
    desc: 'Sturdy yet pliable, perfect for architectural weaves and lasting structural integrity.',
    longDesc: 'Cane and natural rattan bring architectural structure to woven pieces. Sturdy yet pliable, they hold intricate weave patterns while providing the long-term structural integrity that furniture-adjacent basket pieces require.',
    image: '/materials/cane-rattan.png',
  },
  {
    id: '06',
    slug: 'water-hyacinth',
    name: 'Water Hyacinth',
    desc: 'Carefully braided to create warm, chunky weaves with unique character and volume.',
    longDesc: 'Water hyacinth is an invasive aquatic plant that artisans have turned into a valuable craft material — harvesting it doubles as a waterway conservation effort. Braided into warm, chunky weaves, it gives baskets a distinctive textured volume.',
    image: '/materials/water-hyacinth.png',
  },
  {
    id: '07',
    slug: 'kans-grass',
    name: 'Kans Grass',
    desc: 'Wildly grown and carefully harvested for delicate, elegant, yet durable home goods.',
    longDesc: 'Kans grass grows wild across the Bangladesh countryside and is hand-harvested at the right point of maturity. Its slender, elegant strands are woven into delicate-looking pieces that remain surprisingly durable in daily use.',
    image: '/materials/kans-grass.png',
  },
];
