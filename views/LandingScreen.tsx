import React from 'react';
import { ShoppingBag, Store } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const LandingScreen: React.FC = () => {
  const { setUserRole, selectStore } = useStore();

  const handleSellerSelect = () => {
    setUserRole('shopkeeper');
    // For prototype simplicity, Shopkeeper manages Store 1
    selectStore('1'); 
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 animate-in fade-in zoom-in duration-500">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Welcome to Quick<span className="text-primary-600">Kirana</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-lg mx-auto">
          The hyper-local commerce platform connecting neighborhoods.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {/* Customer Card */}
        <button
          onClick={() => setUserRole('customer')}
          className="group relative bg-cream p-8 md:p-12 rounded-3xl border border-orange-200 hover:border-primary-300 transition-all duration-300 text-left overflow-hidden"
        >
          {/* Glowing Corner Accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-bl-full -mr-8 -mt-8 transition-all duration-500 group-hover:bg-primary-200 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]"></div>
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">I am a Customer</h2>
            <p className="text-gray-500">Browse local stores, check inventory, and order essentials instantly.</p>
          </div>
        </button>

        {/* Seller Card */}
        <button
          onClick={handleSellerSelect}
          className="group relative bg-cream p-8 md:p-12 rounded-3xl border border-orange-200 hover:border-accent-300 transition-all duration-300 text-left overflow-hidden"
        >
           {/* Glowing Corner Accent - Darkened for visibility */}
           <div className="absolute top-0 right-0 w-32 h-32 bg-orange-200 rounded-bl-full -mr-8 -mt-8 transition-all duration-500 group-hover:bg-orange-300 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(249,115,22,0.3)]"></div>

          <div className="relative z-10">
            <div className="w-16 h-16 bg-accent-100 text-accent-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
              <Store className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">I am a Shopkeeper</h2>
            <p className="text-gray-500">Manage your inventory, scan products, and fulfill orders in real-time.</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default LandingScreen;