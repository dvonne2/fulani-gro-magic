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
}

export const PACKAGES: Package[] = [
  // Multi-item bundles only
  {
    id: 'PKG-001',
    slug: 'self_love_plus',
    name: 'Complete Hair Growth System',
    price: 32750,
    originalPrice: 65500,
    discount: 50,
    items: '1 x 500ml Heritage Shampoo + 1 x 150ml Growth Pomade + 1 x 500ml Voluminous Conditioner',
    supply: '1-Month Trial',
    freeItems: 'Complete 3-step system — try it for 30 days',
    isPopular: false,
    deliveryFee: 3000,
    label: '',
    sku: 'CHGS-001',
    quantity: 1,
  },
  {
    id: 'PKG-002',
    slug: 'self_love_return',
    name: 'Self Love Return',
    price: 42750,
    originalPrice: 85500,
    discount: 50,
    items: '3 x 150ml Growth Pomades',
    supply: '3-Month Maintenance',
    freeItems: 'Pomade refill — for customers who\'ve done the reset',
    isPopular: false,
    deliveryFee: 3000,
    label: '',
    sku: 'SLR-002',
    quantity: 1,
  },
  {
    id: 'PKG-003',
    slug: 'self_love_b2gof',
    name: 'Self Love B2GOF',
    price: 52750,
    originalPrice: 105500,
    discount: 50,
    items: '3 x 500ml Heritage Shampoos + 3 x 150ml Growth Pomades',
    supply: '3-Month Scalp Reset',
    freeItems: 'Buy 2 shampoos and 2 pomades, get 1 of each free',
    isPopular: false,
    deliveryFee: 3000,
    label: '',
    sku: 'SLB-003',
    quantity: 1,
  },
  {
    id: 'PKG-004',
    slug: 'self_love_plus_b2gof',
    name: 'Self Love Plus B2GOF',
    price: 66750,
    originalPrice: 133500,
    discount: 50,
    items: '3 x 500ml Heritage Shampoos + 3 x 150ml Growth Pomades + 3 x 500ml Voluminous Conditioners',
    supply: '3-Month Hair Recovery',
    freeItems: 'Buy 2 sets of shampoo, pomade and conditioner, get 1 set free',
    isPopular: true,
    deliveryFee: 3000,
    label: 'Best Seller · Best Value · Recommended',
    sku: 'SLPB-004',
    quantity: 1,
  },
  {
    id: 'PKG-005',
    slug: 'family_saves',
    name: 'Family Saves',
    price: 215750,
    originalPrice: 431500,
    discount: 50,
    items: '10 x 500ml Heritage Shampoos + 10 x 150ml Growth Pomades + 10 x 500ml Voluminous Conditioners',
    supply: '12 Month Supply',
    freeItems: 'Buy 6 sets of shampoo, pomade and conditioner, get 4 sets free',
    isPopular: false,
    deliveryFee: 3000,
    label: '',
    sku: 'FAM-005',
    quantity: 1,
  },
];
