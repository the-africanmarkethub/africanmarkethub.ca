export const QueryKeys = {
  // Products
  RECOMMENDED_PRODUCTS: ['products', 'recommended'] as const,
  PRODUCT_DETAILS: (slug: string) => ['products', 'details', slug] as const,
  PRODUCT_CATEGORIES: ['products', 'categories'] as const,
  
  // Services
  RECOMMENDED_SERVICES: ['services', 'recommended'] as const,
  SERVICE_DETAILS: (id: string) => ['services', 'details', id] as const,
  
  // User
  USER_PROFILE: ['user', 'profile'] as const,
  USER_ORDERS: ['user', 'orders'] as const,
  USER_WISHLIST: ['user', 'wishlist'] as const,
  
  // Cart
  CART_ITEMS: ['cart', 'items'] as const,
  ADD_TO_CART: ['cart', 'add'] as const,
  DELETE_CART_ITEM: (id: number) => ['cart', 'delete', id] as const,
  
  // Auth
  AUTH_LOGIN: ['auth', 'login'] as const,
  AUTH_REGISTER: ['auth', 'register'] as const,
  AUTH_VERIFY_EMAIL: ['auth', 'verify-email'] as const,
  AUTH_FORGOT_PASSWORD: ['auth', 'forgot-password'] as const,
  AUTH_RESET_PASSWORD: ['auth', 'reset-password'] as const,
  
  // Locations
  LOCATIONS: ['locations'] as const,
  
  // Addresses
  ADDRESSES: ['addresses'] as const,
  CREATE_ADDRESS: ['addresses', 'create'] as const,
  UPDATE_ADDRESS: (id: number) => ['addresses', 'update', id] as const,
  DELETE_ADDRESS: (id: number) => ['addresses', 'delete', id] as const,
  
  // Shipping
  SHIPPING_RATES: (addressId: number, cartItems: any[]) => ['shipping', 'rates', addressId, cartItems] as const,
  
  // Checkout
  CHECKOUT: ['checkout'] as const,
  
  // Search
  PRODUCT_SEARCH: (query: string, page?: number) => ['products', 'search', query, page] as const,
  
  // Items (products/services)
  ITEMS: (type: string, page?: number, limit?: number) => ['items', type, page, limit] as const,
  
  // Shop
  SHOP_DETAILS: (id: string) => ['shop', 'details', id] as const,
  SHOP_PRODUCTS: (id: string) => ['shop', 'products', id] as const,
  
  // Chat
  CHAT_CONVERSATIONS: ['chat', 'conversations'] as const,
  CHAT_MESSAGES: ['chat', 'messages'] as const,
} as const;