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

const STORES: Store[] = [
  { id: '1', name: 'Raju General Store', deliveryTime: '10 mins', rating: 4.8, image: 'https://images.unsplash.com/photo-1604719312566-b7e2b0084bea?auto=format&fit=crop&q=80&w=300' },
  { id: '2', name: 'Green Valley Mart', deliveryTime: '25 mins', rating: 4.2, image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=300' },
  { id: '3', name: 'Aapka Nukkad', deliveryTime: '15 mins', rating: 4.5, image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=300' },
];

const INITIAL_PRODUCTS: Product[] = [
  // Store 1: Raju General Store
  { barcode: '1111', name: 'Maggi Noodles', price: 14, stock: 20, storeId: '1' },
  { barcode: '2222', name: 'Amul Taaza Milk', price: 54, stock: 10, storeId: '1' },
  { barcode: '3333', name: 'Tata Salt', price: 28, stock: 5, storeId: '1' },
  { barcode: '8888', name: 'Coke 1L', price: 60, stock: 24, storeId: '1' },
  
  // Store 2: Green Valley Mart
  { barcode: '1111', name: 'Maggi Noodles', price: 14, stock: 100, storeId: '2' }, // Better stock
  { barcode: '4444', name: 'Britannia Biscuits', price: 35, stock: 15, storeId: '2' },
  { barcode: '6666', name: 'India Gate Rice', price: 450, stock: 15, storeId: '2' },
  
  // Store 3: Aapka Nukkad
  { barcode: '2222', name: 'Amul Taaza Milk', price: 54, stock: 2, storeId: '3' }, // Low stock
  { barcode: '5555', name: 'Kissan Ketchup', price: 120, stock: 8, storeId: '3' },
  { barcode: '7777', name: 'Lays Chips', price: 20, stock: 50, storeId: '3' },
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // --- Persistent Data ---
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('qk_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
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
      return [...prev, { barcode, name, price, stock: 1, storeId: activeStoreId }];
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