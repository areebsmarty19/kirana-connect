import React, { useState } from 'react';
import { ShoppingCart, Minus, Plus, ShoppingBag, X, Trash2, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const CustomerStore: React.FC = () => {
  const { products, cart, addToCart, removeFromCart, decreaseCartQuantity, placeOrder, isCartOpen, closeCart, openCart } = useStore();
  const [orderSuccess, setOrderSuccess] = useState(false);

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    placeOrder();
    closeCart();
    setOrderSuccess(true);
    setTimeout(() => setOrderSuccess(false), 3000);
  };

  return (
    <div className="pb-24 sm:pb-8">
      
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-green-500 text-white p-6 md:p-10 rounded-2xl mb-6 md:mb-8 shadow-xl shadow-emerald-200/50">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-medium text-emerald-50 mb-3 md:mb-4 border border-white/20">
             <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse"></span>
             Open Now • Delivery in 10 mins
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold mb-2 md:mb-3 leading-tight">Your Neighborhood Kirana, <br/> Now Online.</h2>
          <p className="text-emerald-50 text-sm md:text-lg opacity-90 mb-4 md:mb-6">Order fresh essentials directly from your local store.</p>
          <button 
             onClick={() => document.getElementById('products-grid')?.scrollIntoView({ behavior: 'smooth' })}
             className="bg-white text-emerald-700 px-5 py-2 md:px-6 md:py-2.5 rounded-lg font-bold text-xs md:text-sm shadow-lg hover:bg-emerald-50 hover:scale-105 transition-all duration-300 flex items-center gap-2"
          >
            Start Shopping <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </button>
        </div>
        
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-20 w-60 h-60 bg-green-400/20 rounded-full blur-2xl"></div>
      </div>

      {/* Success Message Toast */}
      {orderSuccess && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl z-50 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <ArrowRight className="w-4 h-4 text-white" />
          </div>
          <span className="font-medium">Order sent to QuickKirana Partner!</span>
        </div>
      )}

      {/* Section Header */}
      <div className="flex justify-between items-center mb-4 md:mb-6" id="products-grid">
         <h3 className="text-lg md:text-xl font-bold text-gray-800">Available Products</h3>
         <span className="text-xs md:text-sm text-gray-500">{products.length} items nearby</span>
      </div>

      {/* Product Grid - Tighter gap on mobile */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
        {products.map((product) => {
          const inCart = cart.find(i => i.barcode === product.barcode);
          
          return (
            <div key={product.barcode} className="group relative bg-cream p-3 md:p-4 rounded-xl border border-orange-200 flex flex-col justify-between h-full hover:border-orange-300 hover:-translate-y-1 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md">
              {/* Glowing Corner Accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary-50 rounded-bl-full -mr-12 -mt-12 transition-all duration-500 group-hover:bg-primary-200 group-hover:scale-125 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] z-0"></div>

              <div className="mb-3 md:mb-4 relative z-10">
                <div className="relative aspect-square bg-white rounded-xl mb-3 md:mb-4 overflow-hidden border border-orange-100">
                   <img 
                    src={`https://picsum.photos/seed/${product.barcode}/400`} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Badge */}
                  {product.stock <= 5 && product.stock > 0 && (
                     <div className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                       Only {product.stock} left
                     </div>
                  )}
                  {inCart && (
                    <div className="absolute inset-0 bg-primary-900/10 flex items-center justify-center backdrop-blur-[1px] animate-in fade-in">
                       <div className="bg-cream text-primary-600 font-bold px-3 py-1 rounded-full shadow-md text-xs transform scale-110 border border-orange-200">
                         {inCart.quantity} in cart
                       </div>
                    </div>
                  )}
                </div>
                
                <h3 className="font-semibold text-gray-800 text-sm md:text-base leading-snug mb-1 group-hover:text-primary-600 transition-colors line-clamp-2">{product.name}</h3>
                <div className="text-gray-500 text-[10px] md:text-xs">Unit Price</div>
              </div>
              
              <div className="flex items-center justify-between mt-auto pt-2 md:pt-3 border-t border-orange-100 relative z-10">
                <span className="font-bold text-base md:text-lg text-gray-900">₹{product.price}</span>
                
                {product.stock === 0 ? (
                  <span className="text-[10px] md:text-xs text-red-500 font-medium bg-red-50 px-2 py-1 md:px-3 md:py-1.5 rounded-full border border-red-100">Out of Stock</span>
                ) : inCart ? (
                  <div className="flex items-center bg-primary-600 rounded-full h-8 md:h-9 shadow-lg shadow-primary-200/50 animate-in fade-in zoom-in duration-200">
                    <button 
                      onClick={(e) => { e.stopPropagation(); decreaseCartQuantity(product.barcode); }}
                      className="w-7 md:w-8 h-full flex items-center justify-center text-white hover:bg-primary-700 rounded-l-full transition-colors active:bg-primary-800"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3 md:w-4 md:h-4" />
                    </button>
                    <span className="w-4 text-center text-xs md:text-sm font-bold text-white select-none leading-none">{inCart.quantity}</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                      disabled={inCart.quantity >= product.stock}
                      className={`w-7 md:w-8 h-full flex items-center justify-center rounded-r-full transition-colors active:bg-primary-800 ${
                        inCart.quantity >= product.stock 
                          ? 'text-white/40 cursor-not-allowed' 
                          : 'text-white hover:bg-primary-700'
                      }`}
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3 md:w-4 md:h-4" />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => addToCart(product)}
                    className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-full transition-all active:scale-95 shadow-sm bg-orange-50 text-gray-600 hover:bg-primary-50 hover:text-primary-600 border border-orange-100 hover:border-primary-200 group-hover:shadow-md"
                    aria-label="Add to cart"
                  >
                    <Plus className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile Floating Cart Bar */}
      {cartCount > 0 && (
        <div className="fixed bottom-6 left-4 right-4 z-40 md:hidden animate-in slide-in-from-bottom-6 fade-in">
          <button 
            onClick={openCart}
            className="w-full bg-gray-900 text-white p-4 rounded-2xl shadow-xl flex justify-between items-center hover:bg-gray-800 transition active:scale-95 ring-2 ring-white/50"
          >
            <div className="flex items-center gap-3">
              <div className="bg-primary-500 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm">
                {cartCount}
              </div>
              <div className="flex flex-col items-start">
                 <span className="font-medium text-sm text-gray-300">Total</span>
                 <span className="font-bold text-lg leading-none">₹{cartTotal}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold bg-white/10 px-4 py-2 rounded-lg">
               View Cart <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* Cart Drawer (Side Modal) */}
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity" onClick={closeCart}></div>
          
          {/* Drawer */}
          <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[400px] bg-cream shadow-2xl flex flex-col transform transition-transform animate-in slide-in-from-right duration-300 border-l border-orange-200">
            <div className="p-6 border-b border-orange-200 flex justify-between items-center bg-cream">
              <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900">
                <ShoppingBag className="w-6 h-6 text-primary-600" />
                Your Bag
              </h2>
              <button onClick={closeCart} className="p-2 hover:bg-orange-100 rounded-full text-gray-500 hover:text-gray-800 transition">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                  <ShoppingBag className="w-16 h-16 opacity-20" />
                  <p className="font-medium">Your cart is empty</p>
                  <button onClick={closeCart} className="text-primary-600 font-semibold hover:underline">
                    Browse Products
                  </button>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.barcode} className="flex gap-4 animate-in slide-in-from-bottom-2">
                     <div className="w-20 h-20 shrink-0 bg-white rounded-lg overflow-hidden border border-orange-100">
                       <img 
                        src={`https://picsum.photos/seed/${item.barcode}/100`} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                     </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900 leading-tight">{item.name}</h4>
                        <p className="text-sm text-gray-500 mt-1">Unit: ₹{item.price}</p>
                      </div>
                      <div className="flex justify-between items-end">
                         <div className="font-bold text-gray-900">₹{item.price * item.quantity}</div>
                         
                         {/* Cart Drawer Quantity Control */}
                         <div className="flex items-center bg-white border border-primary-200 rounded-lg h-8">
                            <button 
                                onClick={() => decreaseCartQuantity(item.barcode)}
                                className="w-8 h-full flex items-center justify-center text-primary-600 hover:bg-primary-50 rounded-l-lg transition-colors"
                            >
                                <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-bold text-primary-700">{item.quantity}</span>
                            <button 
                                onClick={() => addToCart(item)}
                                className="w-8 h-full flex items-center justify-center text-primary-600 hover:bg-primary-50 rounded-r-lg transition-colors"
                            >
                                <Plus className="w-3 h-3" />
                            </button>
                         </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-orange-200 bg-orange-50/50">
                <div className="space-y-3 mb-6">
                   <div className="flex justify-between text-sm text-gray-600">
                     <span>Subtotal</span>
                     <span>₹{cartTotal}</span>
                   </div>
                   <div className="flex justify-between text-sm text-gray-600">
                     <span>Delivery Fee</span>
                     <span className="text-green-600 font-medium">Free</span>
                   </div>
                   <div className="border-t border-orange-200 pt-3 flex justify-between items-center">
                     <span className="font-bold text-gray-900 text-lg">Total</span>
                     <span className="font-bold text-primary-600 text-2xl">₹{cartTotal}</span>
                   </div>
                </div>
                
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-primary-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary-200 hover:bg-primary-700 hover:shadow-primary-300 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
                >
                  Place Order <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CustomerStore;