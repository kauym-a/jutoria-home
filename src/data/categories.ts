export type Category = {
  id: string;
  slug: string;
  name: string;
  desc: string;
  longDesc: string;
  /** Hero/card image. Null where a real photo isn't available yet — the UI falls back gracefully. */
  image: string | null;
};

// Our Categories — shared across the Home page grid (if added), the /categories index page,
// and each /categories/:slug detail page. Values match the `category` field used on Product
// records and in the admin Product Form dropdown — keep these two lists in sync.
export const categories: Category[] = [
  {
    id: '01',
    slug: 'placemats',
    name: 'Placemats',
    desc: 'Hand-braided rounds and sets that bring natural texture to every table setting.',
    longDesc:
      'Our placemats are hand-braided from jute and seagrass into dense, durable rounds. Reversible, heat-resistant and finished with a clean edge, they are built for daily use in both hospitality and residential settings — sold individually or as matched sets.',
    image: '/placemat-product.jpg',
  },
  {
    id: '02',
    slug: 'planter-baskets',
    name: 'Planter Baskets',
    desc: 'Sturdy woven baskets shaped to hold plants, storage bins, and everyday essentials.',
    longDesc:
      'Planter baskets are woven for structure — round, tapered forms with reinforced bases that hold their shape under weight. Available in natural, seagrass and jute finishes, sized to nest together for retail display or bulk shipping.',
    image: '/jute-basket-product.jpg',
  },
  {
    id: '03',
    slug: 'laundry-baskets',
    name: 'Laundry Baskets',
    desc: 'Deep, reinforced baskets woven for daily handling and long-term durability.',
    longDesc:
      'Built for daily wear, our laundry baskets combine seagrass and jute for extra structural strength. Deep, wide-mouthed forms with reinforced rims make them equally at home in a laundry room, nursery or living space.',
    image: '/laundry-basket-product.jpg',
  },
  {
    id: '04',
    slug: 'organizer-baskets',
    name: 'Organizer Baskets',
    desc: 'Compartmentalized woven trays and baskets for tidy, styled storage.',
    longDesc:
      'Organizer baskets bring the same hand-weaving techniques to smaller, compartmentalized forms — designed for desks, shelves and vanities where storage needs to look as good as it functions.',
    image: '/organizer-basket-product.jpg',
  },
  {
    id: '05',
    slug: 'floor-mats-rugs',
    name: 'Floor Mats / Rugs',
    desc: 'Flat-braided jute floor coverings, from entryway mats to full room rugs.',
    longDesc:
      'Woven from 100% jute or a jute-cotton blend, our floor mats and rugs are flat-braided and stitched into rounds and rectangles from entryway size up to full room dimensions — durable underfoot and fully biodegradable.',
    image: '/floor-mats-rugs.jpg',
  },
];
