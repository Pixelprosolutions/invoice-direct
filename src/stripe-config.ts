export const STRIPE_CONFIG = {
  products: {
    lifetimeAccess: {
      id: 'prod_SkOfQw8tQa6xIf',
      priceId: 'price_1Rots22OqqTomYvmdgVZW4H0',
      name: 'Lifetime Access',
      description: 'Get unlimited access to all features with a one-time payment',
      mode: 'payment' as const,
      price: 1000, // $10.00 in cents
    },
  },
} as const;

export type ProductId = keyof typeof STRIPE_CONFIG.products;
export type Product = typeof STRIPE_CONFIG.products[ProductId];