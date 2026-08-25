export interface PackageBadge {
  text: string;
  tone: 'accent' | 'success';
}

export interface PackageValueRow {
  label: string;
  amount: number;
  strong?: boolean;
}

export interface Package {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  items: string;
  supply: string;
  freeItems: string;
  isPopular: boolean;
  deliveryFee: number;
  label: string;
  sku: string;
  quantity: number;

  // Display-only copy. `name` stays the wire/fulfilment identifier (order payload
  // `package` field and the ThankYou product map key), so customer-facing renames
  // live here instead.
  displayName?: string;
  itemsLabel?: string;
  offerBullets?: string[];
  badges?: PackageBadge[];
  referencePrice?: number;
  valueBreakdown?: PackageValueRow[];
  tagline?: string;
  highlight?: boolean;
}

export const PACKAGES: Package[] = [
  // Multi-item bundles only
  {
    id: 'PKG-001',
    slug: 'self_love_plus',
    name: 'Complete Hair Growth System',
    price: 27450,
    originalPrice: 54900,
    discount: 50,
    items: '1 x 500ml Heritage Shampoo + 1 x 150ml Growth Pomade + 1 x 500ml Voluminous Conditioner',
    supply: '1-Month Trial',
    freeItems: 'Complete 3-step system — try it for 30 days',
    isPopular: false,
    deliveryFee: 3000,
    label: '',
    sku: 'CHGS-001',
    quantity: 1,
    displayName: 'Self Love Plus',
    itemsLabel: '1 shampoo, 1 pomade, 1 conditioner',
  },
  {
    id: 'PKG-002',
    slug: 'self_love_return',
    name: 'Self Love Return',
    price: 39900,
    originalPrice: 79800,
    discount: 50,
    items: '3 x 150ml Growth Pomades',
    supply: '3-Month Maintenance',
    freeItems: 'Pomade refill — for customers who\'ve done the reset',
    isPopular: false,
    deliveryFee: 3000,
    label: '',
    sku: 'SLR-002',
    quantity: 1,
    itemsLabel: '3 pomades',
  },
  {
    id: 'PKG-004',
    slug: 'self_love_plus_b2gof',
    name: 'Self Love Plus B2GOF',
    price: 55950,
    originalPrice: 133500,
    discount: 50,
    items: '3 x 500ml Heritage Shampoos + 3 x 150ml Growth Pomades + 3 x 500ml Voluminous Conditioners',
    supply: '3-Month Hair Recovery',
    freeItems: 'Buy 2 sets of shampoo, pomade and conditioner, get 1 set free',
    isPopular: true,
    deliveryFee: 3000,
    label: 'BEST DEAL',
    sku: 'SLPB-004',
    quantity: 1,
    displayName: 'Self Love Plus B2GOF',
    highlight: true,
    offerBullets: [
      'Buy 2 Shampoos → Get 1 FREE',
      'Buy 2 Pomades → Get 1 FREE',
      'Buy 2 Conditioners → Get 1 FREE',
    ],
    badges: [
      { text: 'Best deal', tone: 'accent' },
      { text: 'Save ₦26,400', tone: 'success' },
    ],
    referencePrice: 82350,
    valueBreakdown: [
      { label: '2 complete sets', amount: 54900 },
      { label: 'Add just', amount: 1050 },
      { label: 'Get 3rd complete set FREE — Worth', amount: 27450, strong: true },
    ],
    tagline: 'FREE DELIVERY TODAY ONLY',
  },
  {
    id: 'PKG-005',
    slug: 'family_saves',
    name: 'Family Saves',
    price: 180800,
    originalPrice: 361600,
    discount: 50,
    items: '10 x 500ml Heritage Shampoos + 10 x 150ml Growth Pomades + 10 x 500ml Voluminous Conditioners',
    supply: '12 Month Supply',
    freeItems: 'Buy 6 sets of shampoo, pomade and conditioner, get 4 sets free',
    isPopular: false,
    deliveryFee: 3000,
    label: '',
    sku: 'FAM-005',
    quantity: 1,
    itemsLabel: '10 shampoos, 10 pomades, 10 conditioners',
  },
];
