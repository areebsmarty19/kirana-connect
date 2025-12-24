import React from 'react';
import { Store as StoreIcon, UserCircle2, ShoppingCart, MapPin, ChevronLeft, LogOut } from 'lucide-react';
import { StoreProvider, useStore } from './context/StoreContext';
import LandingScreen from './views/LandingScreen';
import StoreSelection from './views/StoreSelection';
import ShopkeeperDashboard from './views/ShopkeeperDashboard';
import CustomerStore from './views/CustomerStore';

const Navbar: React.FC = () => {
  const { userRole, activeStore, cart, openCart, setUserRole, exitStore } = useStore();
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (!userRole) return null; // No Navbar on Landing Screen

  return (
    <header className="bg-cream sticky top-0 z-30 border-b border-orange-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left Side: Brand & Context */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => { setUserRole(null); exitStore(); }}>
            <div className={`text-white p-2 rounded-lg shadow-sm ${userRole === 'shopkeeper' ? 'bg-accent-600' : 'bg-primary-600'}`}>
              <StoreIcon className="w-5 h-5" />
            </div>
            <h1 className="font-bold text-xl tracking-tight text-gray-800 hidden md:block">
              Quick<span className={userRole === 'shopkeeper' ? 'text-accent-600' : 'text-primary-600'}>Kirana</span>
            </h1>
          </div>

          {/* Active Store Indicator (Customer Mode) */}
          {userRole === 'customer' && activeStore && (
            <>
              <div className="h-6 w-px bg-orange-200 hidden md:block"></div>
              <div className="flex items-center gap-2">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider leading-none">Shopping at</span>
                  <span className="text-sm font-semibold text-gray-900 leading-tight flex items-center gap-1">
                    {activeStore.name}
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  </span>
                </div>
                <button 
                  onClick={exitStore}
                  className="ml-2 text-xs text-primary-600 hover:text-primary-700 bg-orange-100 hover:bg-orange-200 px-2 py-1 rounded-md transition-colors"
                >
                  Change
                </button>
              </div>
            </>
          )}

           {/* Active Store Indicator (Seller Mode) */}
           {userRole === 'shopkeeper' && activeStore && (
             <div className="ml-2 bg-orange-100 text-accent-700 px-3 py-1 rounded-full text-xs font-bold border border-orange-200">
               Managing: {activeStore.name}
             </div>
           )}
        </div>
        
        {/* Right Side: Actions */}
        <div className="flex items-center gap-4">
          
          <div className="flex items-center gap-3">
             <span className={`px-4 py-1.5 rounded-full text-xs font-bold border shadow-sm uppercase tracking-wide hidden sm:block ${
               userRole === 'customer' 
                 ? 'bg-primary-50 text-primary-700 border-primary-200' 
                 : 'bg-accent-600 text-white border-transparent shadow-md'
             }`}>
               {userRole === 'customer' ? 'Customer View' : 'Seller Dashboard'}
             </span>
             
             {/* Divider */}
             <div className="h-6 w-px bg-gray-200 mx-1"></div>

             {/* Logout / Switch Role */}
             <button 
               onClick={() => { setUserRole(null); exitStore(); }}
               className="p-2.5 bg-white text-gray-500 border border-gray-200 hover:text-red-600 hover:border-red-200 hover:bg-red-50 rounded-full transition-all shadow-sm active:scale-95 group"
               title="Exit to Home"
             >
               <LogOut className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
             </button>

             {/* Cart Icon (Customer Only) */}
             {userRole === 'customer' && activeStore && (
               <button 
                 onClick={openCart}
                 className={`relative p-2.5 rounded-full transition-all shadow-sm active:scale-95 border group ${
                    cartItemCount > 0 
                      ? 'bg-primary-600 text-white border-primary-600 hover:bg-primary-700' 
                      : 'bg-white text-primary-600 border-primary-200 hover:bg-primary-50 hover:border-primary-300'
                 }`}
               >
                 <ShoppingCart className="w-5 h-5" />
                 {cartItemCount > 0 && (
                   <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold leading-none text-primary-600 bg-white rounded-full border border-primary-100 shadow-sm">
                     {cartItemCount}
                   </span>
                 )}
               </button>
             )}
          </div>
        </div>
      </div>
    </header>
  );
};

const MainLayout: React.FC = () => {
  const { userRole, activeStore, clearData } = useStore();

  const renderContent = () => {
    if (!userRole) return <LandingScreen />;
    
    if (userRole === 'customer') {
      return activeStore ? <CustomerStore /> : <StoreSelection />;
    }
    
    if (userRole === 'shopkeeper') {
      return <ShopkeeperDashboard />;
    }
    
    return null;
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col font-sans text-gray-900">
      <Navbar />
      
      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
      
      {/* Footer */}
      <footer className="bg-cream border-t border-orange-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-400">QuickKirana Prototype v2.1</p>
          <button 
            onClick={() => { if(confirm('Reset all application data?')) clearData(); }} 
            className="text-xs text-gray-300 hover:text-red-500 underline mt-2 transition-colors"
          >
            Reset System
          </button>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <StoreProvider>
      <MainLayout />
    </StoreProvider>
  );
};

export default App;