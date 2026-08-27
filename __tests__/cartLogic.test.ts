import { useCartStore } from '../src/store/useCartStore';
import { Product } from '../src/types';

describe('Cart Store Logic', () => {
  const dummyProduct: Product = {
    id: 'prod-1',
    name: 'Ashwagandha Churna',
    brand: 'Amrutam',
    category: 'Herbal Supplements',
    price: 300,
    rating: 4.8,
    reviewsCount: 150,
    doshaTarget: 'Vata',
    description: 'Relieves stress',
    benefits: ['Stress relief'],
    ingredients: ['Ashwagandha'],
    inStock: true,
    imageUrl: 'https://picsum.photos/200',
  };

  beforeEach(() => {
    useCartStore.setState({ cart: [], wishlist: [], isLoading: false });
  });

  test('adds product to cart and calculates subtotal & delivery fee', () => {
    useCartStore.getState().addToCart(dummyProduct, 1);

    const { subtotal, deliveryFee, total, itemCount } = useCartStore.getState().getCartTotal();
    expect(itemCount).toBe(1);
    expect(subtotal).toBe(300);
    expect(deliveryFee).toBe(49); // Delivery fee applied under ₹500 threshold
    expect(total).toBe(349);
  });

  test('waives delivery fee when subtotal exceeds ₹499', () => {
    useCartStore.getState().addToCart(dummyProduct, 2); // 2 * 300 = 600

    const { subtotal, deliveryFee, total } = useCartStore.getState().getCartTotal();
    expect(subtotal).toBe(600);
    expect(deliveryFee).toBe(0);
    expect(total).toBe(600);
  });

  test('updates quantity and removes item when quantity becomes 0', () => {
    useCartStore.getState().addToCart(dummyProduct, 2);
    useCartStore.getState().updateQuantity('prod-1', 0);

    expect(useCartStore.getState().cart.length).toBe(0);
  });
});
