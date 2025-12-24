import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { Product, Order, CartItem, Store, UserRole } from '../types';

interface StoreContextType {
  // Data
  stores: Store[];
  products: Product[]; // Filtered by activeStoreId
  orders: Order[]; // Filtered by activeStoreId
  cart: CartItem[];
  
  // State
  userRole: UserRole;
  activeStore: Store | undefined;
  isCartOpen: boolean;

  // Actions
  setUserRole: (role: UserRole) => void;
  selectStore: (storeId: string) => void;
  addProduct: (barcode: string, name: string, price: number) => void;
  incrementStock: (barcode: string, amount?: number) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (barcode: string) => void;
  decreaseCartQuantity: (barcode: string) => void;
  placeOrder: () => void;
  dispatchOrder: (orderId: string) => void;
  clearData: () => void;
  openCart: () => void;
  closeCart: () => void;
  exitStore: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Reliable Store Images
const STORES: Store[] = [
  { 
    id: '1', 
    name: 'Raju General Store', 
    deliveryTime: '10 mins', 
    rating: 4.8, 
    image: 'https://images.unsplash.com/photo-1601599561096-f87c95fff1e9?auto=format&fit=crop&q=80&w=800' // Indian Kirana Style
  },
  { 
    id: '2', 
    name: 'Green Valley Mart', 
    deliveryTime: '25 mins', 
    rating: 4.2, 
    image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=800' // Modern Mart
  },
  { 
    id: '3', 
    name: 'Aapka Nukkad', 
    deliveryTime: '15 mins', 
    rating: 4.5, 
    image: 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?auto=format&fit=crop&q=80&w=800' // Local Shop
  },
];

// Reliable Product Images mapped by category/item
const PROD_IMGS = {
  maggi: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=400&q=80',
  milk: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80',
  juice: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80', // New Item
  coke: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80',
  biscuits: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=400&q=80',
  rice: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80',
  ketchup: 'https://images.unsplash.com/photo-1607301406259-dfb186e15de8?auto=format&fit=crop&w=400&q=80',
  chips: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=400&q=80',
  default: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80'
};

const INITIAL_PRODUCTS: Product[] = [
  // Store 1: Raju General Store
  { barcode: '1111', name: 'Maggi Noodles', price: 14, stock: 20, storeId: '1', image: PROD_IMGS.maggi },
  { barcode: '2222', name: 'Amul Taaza Milk', price: 54, stock: 10, storeId: '1', image: PROD_IMGS.milk },
  { barcode: '3334', name: 'Tropicana Slice', price: 95, stock: 12, storeId: '1', image: PROD_IMGS.juice }, // New Item replacing broken one
  { barcode: '8888', name: 'Coke 1L', price: 60, stock: 24, storeId: '1', image: PROD_IMGS.coke },
  
  // Store 2: Green Valley Mart
  { barcode: '1111', name: 'Maggi Noodles', price: 14, stock: 100, storeId: '2', image: PROD_IMGS.maggi }, 
  { barcode: '4444', name: 'Britannia Biscuits', price: 35, stock: 15, storeId: '2', image: PROD_IMGS.biscuits },
  { barcode: '6666', name: 'India Gate Rice', price: 450, stock: 15, storeId: '2', image: PROD_IMGS.rice },
  
  // Store 3: Aapka Nukkad
  { barcode: '2222', name: 'Amul Taaza Milk', price: 54, stock: 2, storeId: '3', image: PROD_IMGS.milk },
  { barcode: '5555', name: 'Kissan Ketchup', price: 120, stock: 8, storeId: '3', image: PROD_IMGS.ketchup },
  { barcode: '7777', name: 'Lays Chips', price: 20, stock: 50, storeId: '3', image: PROD_IMGS.chips },
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // --- Persistent Data ---
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('qk_products');
    let currentProducts = saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    
    // CACHE CLEANUP & HYDRATION
    // 1. Filter out the broken barcode '3333' from old cache
    currentProducts = currentProducts.filter((p: Product) => p.barcode !== '3333');
    
    // 2. Ensure new items (like 3334) are added if missing from cache
    INITIAL_PRODUCTS.forEach(initP => {
        const exists = currentProducts.find((p: Product) => p.barcode === initP.barcode && p.storeId === initP.storeId);
        if (!exists) {
            currentProducts.push(initP);
        }
    });

    // 3. Update images/names/prices for existing items from source code
    currentProducts = currentProducts.map((p: Product) => {
        const fresh = INITIAL_PRODUCTS.find(i => i.barcode === p.barcode && i.storeId === p.storeId);
        if (fresh) {
           return { ...p, name: fresh.name, price: fresh.price, image: fresh.image };
        }
        return p;
    });
    
    return currentProducts;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('qk_orders');
    return saved ? JSON.parse(saved) : [];
  });

  // --- Session State ---
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [activeStoreId, setActiveStoreId] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // --- Persistence Effects ---
  useEffect(() => localStorage.setItem('qk_products', JSON.stringify(products)), [products]);
  useEffect(() => localStorage.setItem('qk_orders', JSON.stringify(orders)), [orders]);

  // --- Derived State ---
  const activeStore = useMemo(() => STORES.find(s => s.id === activeStoreId), [activeStoreId]);
  
  const visibleProducts = useMemo(() => {
    if (!activeStoreId) return [];
    return products.filter(p => p.storeId === activeStoreId);
  }, [products, activeStoreId]);

  const visibleOrders = useMemo(() => {
    if (!activeStoreId) return [];
    return orders.filter(o => o.storeId === activeStoreId);
  }, [orders, activeStoreId]);

  // --- Actions ---

  const selectStore = (storeId: string) => {
    setActiveStoreId(storeId);
    setCart([]); // Clear cart when switching stores
  };

  const exitStore = () => {
    setActiveStoreId(null);
    setCart([]);
  };

  const addProduct = (barcode: string, name: string, price: number) => {
    if (!activeStoreId) return;
    setProducts(prev => {
      // Check if exists in THIS store
      const exists = prev.find(p => p.barcode === barcode && p.storeId === activeStoreId);
      if (exists) return prev; 
      // For new products added via scan, we assign a default image
      return [...prev, { 
        barcode, 
        name, 
        price, 
        stock: 1, 
        storeId: activeStoreId,
        image: PROD_IMGS.default 
      }];
    });
  };

  const incrementStock = (barcode: string, amount: number = 1) => {
    if (!activeStoreId) return;
    setProducts(prev => prev.map(p => 
      (p.barcode === barcode && p.storeId === activeStoreId) 
        ? { ...p, stock: p.stock + amount } 
        : p
    ));
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.barcode === product.barcode);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map(item => 
          item.barcode === product.barcode ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (barcode: string) => {
    setCart(prev => prev.filter(item => item.barcode !== barcode));
  };

  const decreaseCartQuantity = (barcode: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.barcode === barcode);
      if (!existing) return prev;
      
      if (existing.quantity > 1) {
        return prev.map(item => 
          item.barcode === barcode ? { ...item, quantity: item.quantity - 1 } : item
        );
      } else {
        return prev.filter(item => item.barcode !== barcode);
      }
    });
  };

  const placeOrder = () => {
    if (cart.length === 0 || !activeStoreId) return;
    
    const newOrder: Order = {
      id: Date.now().toString().slice(-6),
      items: [...cart],
      total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      status: 'pending',
      createdAt: Date.now(),
      storeId: activeStoreId
    };

    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
  };

  const dispatchOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    // Deduct stock globally
    setProducts(prev => {
      let newProducts = [...prev];
      order.items.forEach(item => {
        // Find product matching barcode AND storeId
        const prodIndex = newProducts.findIndex(p => p.barcode === item.barcode && p.storeId === order.storeId);
        if (prodIndex > -1) {
          newProducts[prodIndex] = {
            ...newProducts[prodIndex],
            stock: Math.max(0, newProducts[prodIndex].stock - item.quantity)
          };
        }
      });
      return newProducts;
    });

    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'completed' } : o));
  };

  const clearData = () => {
    setProducts(INITIAL_PRODUCTS);
    setOrders([]);
    setCart([]);
    localStorage.clear();
    window.location.reload();
  };

  return (
    <StoreContext.Provider value={{
      stores: STORES,
      products: visibleProducts,
      orders: visibleOrders,
      cart,
      userRole,
      activeStore,
      isCartOpen,
      setUserRole,
      selectStore,
      exitStore,
      addProduct,
      incrementStock,
      addToCart,
      removeFromCart,
      decreaseCartQuantity,
      placeOrder,
      dispatchOrder,
      clearData,
      openCart: () => setIsCartOpen(true),
      closeCart: () => setIsCartOpen(false)
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};