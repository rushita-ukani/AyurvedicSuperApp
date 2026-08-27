import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product, CartItem } from '../types';
import { logger } from '../utils/logger';

const CART_STORAGE_KEY = '@ayurvedic_super_app_cart_v1';
const WISHLIST_STORAGE_KEY = '@ayurvedic_super_app_wishlist_v1';

interface CartState {
  cart: CartItem[];
  wishlist: Product[];
  isLoading: boolean;

  // Actions
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  loadPersistedCart: () => Promise<void>;
  
  // Computed helpers
  getCartTotal: () => { subtotal: number; deliveryFee: number; total: number; itemCount: number };
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: [],
  wishlist: [],
  isLoading: true,

  addToCart: (product, qty = 1) => {
    const { cart } = get();
    const existingIndex = cart.findIndex(item => item.product.id === product.id);

    let updatedCart: CartItem[];
    if (existingIndex > -1) {
      updatedCart = [...cart];
      updatedCart[existingIndex] = {
        ...updatedCart[existingIndex],
        quantity: updatedCart[existingIndex].quantity + qty,
      };
    } else {
      updatedCart = [...cart, { product, quantity: qty }];
    }

    set({ cart: updatedCart });
    saveCart(updatedCart);
  },

  removeFromCart: (productId) => {
    const updatedCart = get().cart.filter(item => item.product.id !== productId);
    set({ cart: updatedCart });
    saveCart(updatedCart);
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }
    const updatedCart = get().cart.map(item =>
      item.product.id === productId ? { ...item, quantity } : item
    );
    set({ cart: updatedCart });
    saveCart(updatedCart);
  },

  clearCart: () => {
    set({ cart: [] });
    saveCart([]);
  },

  toggleWishlist: (product) => {
    const { wishlist } = get();
    const exists = wishlist.some(p => p.id === product.id);
    let updatedWishlist: Product[];
    if (exists) {
      updatedWishlist = wishlist.filter(p => p.id !== product.id);
    } else {
      updatedWishlist = [...wishlist, product];
    }
    set({ wishlist: updatedWishlist });
    saveWishlist(updatedWishlist);
  },

  isInWishlist: (productId) => {
    return get().wishlist.some(p => p.id === productId);
  },

  loadPersistedCart: async () => {
    try {
      const cartRaw = await AsyncStorage.getItem(CART_STORAGE_KEY);
      const wishlistRaw = await AsyncStorage.getItem(WISHLIST_STORAGE_KEY);
      set({
        cart: cartRaw ? JSON.parse(cartRaw) : [],
        wishlist: wishlistRaw ? JSON.parse(wishlistRaw) : [],
        isLoading: false,
      });
    } catch (e) {
      logger.error('useCartStore', 'Failed to load persisted cart', e);
      set({ isLoading: false });
    }
  },

  getCartTotal: () => {
    const { cart } = get();
    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const deliveryFee = subtotal > 499 || subtotal === 0 ? 0 : 49;
    const total = subtotal + deliveryFee;

    return { subtotal, deliveryFee, total, itemCount };
  },
}));

async function saveCart(cart: CartItem[]) {
  try {
    await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (e) {
    logger.error('useCartStore', 'Failed to persist cart', e);
  }
}

async function saveWishlist(wishlist: Product[]) {
  try {
    await AsyncStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
  } catch (e) {
    logger.error('useCartStore', 'Failed to persist wishlist', e);
  }
}
