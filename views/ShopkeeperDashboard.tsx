import React, { useState } from 'react';
import { Plus, Package, ScanBarcode, ArrowRight, ClipboardList, CheckCircle, Search, Truck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import ScannerModal from '../components/ScannerModal';
import { Product } from '../types';

const ShopkeeperDashboard: React.FC = () => {
  const { products, orders, addProduct, incrementStock, dispatchOrder } = useStore();
  
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders'>('inventory');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');
  
  // New Product Modal State
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [newProductData, setNewProductData] = useState({ barcode: '', name: '', price: '' });
  
  // Dispatch Verification State
  const [verifyingOrderId, setVerifyingOrderId] = useState<string | null>(null);

  const handleScanResult = (code: string) => {
    setIsScannerOpen(false);
    
    if (verifyingOrderId) {
      handleDispatchVerification(code);
      return;
    }
    handleInventoryScan(code);
  };

  const handleInventoryScan = (code: string) => {
    const existing = products.find(p => p.barcode === code);
    if (existing) {
      incrementStock(code, 1);
      alert(`Stock updated! +1 to ${existing.name}`);
    } else {
      setNewProductData({ barcode: code, name: '', price: '' });
      setIsNewProductModalOpen(true);
    }
  };

  const handleDispatchVerification = (code: string) => {
    if (products.some(p => p.barcode === code)) {
       dispatchOrder(verifyingOrderId!);
       setVerifyingOrderId(null);
       alert("Verified & Dispatched successfully!");
    } else {
       alert("Unknown item! Scan a valid product to verify dispatch.");
    }
  };

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualBarcode.trim()) {
      handleInventoryScan(manualBarcode);
      setManualBarcode('');
    }
  };

  const submitNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProductData.name && newProductData.price) {
      addProduct(newProductData.barcode, newProductData.name, parseFloat(newProductData.price));
      setIsNewProductModalOpen(false);
      setNewProductData({ barcode: '', name: '', price: '' });
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-cream p-5 rounded-xl border border-orange-200">
          <div className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Total Inventory</div>
          <div className="text-3xl font-bold text-gray-800">
            {products.reduce((acc, p) => acc + p.stock, 0)}
          </div>
        </div>
        <div className="bg-cream p-5 rounded-xl border border-orange-200">
          <div className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Unique Items</div>
          <div className="text-3xl font-bold text-gray-800">
            {products.length}
          </div>
        </div>
        <div className="bg-cream p-5 rounded-xl border border-orange-200">
          <div className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Pending Orders</div>
          <div className="text-3xl font-bold text-accent-600">
            {orders.filter(o => o.status === 'pending').length}
          </div>
        </div>
        <div className="bg-cream p-5 rounded-xl border border-orange-200">
          <div className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Completed</div>
          <div className="text-3xl font-bold text-green-600">
            {orders.filter(o => o.status === 'completed').length}
          </div>
        </div>
      </div>

      {/* Tabs - Updated for Professional Seller Theme */}
      <div className="flex bg-orange-200/40 p-1.5 rounded-xl max-w-md mx-auto sm:mx-0 border border-orange-200">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-200 shadow-sm ${
            activeTab === 'inventory' 
            ? 'bg-accent-600 text-white shadow-md' 
            : 'text-orange-900 hover:bg-orange-200/50 hover:text-accent-800 bg-transparent shadow-none'
          }`}
        >
          Inventory Management
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-200 shadow-sm ${
            activeTab === 'orders' 
            ? 'bg-accent-600 text-white shadow-md' 
            : 'text-orange-900 hover:bg-orange-200/50 hover:text-accent-800 bg-transparent shadow-none'
          }`}
        >
          Order Dashboard
        </button>
      </div>

      {/* Inventory View */}
      {activeTab === 'inventory' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          {/* Add Stock Action Area - Updated Background to White for BOLD contrast */}
          <div className="bg-white p-6 rounded-2xl border border-orange-200 shadow-md">
            <h2 className="font-semibold text-lg flex items-center gap-2 mb-4 text-gray-900">
              <Package className="w-5 h-5 text-accent-600" />
              Quick Actions
            </h2>
            
            <div className="flex flex-col md:flex-row gap-4">
              <button 
                onClick={() => { setVerifyingOrderId(null); setIsScannerOpen(true); }}
                className="flex-1 md:max-w-xs flex items-center justify-center gap-3 bg-gray-900 text-white p-4 rounded-xl hover:bg-gray-800 transition shadow-lg shadow-gray-200 active:scale-95 group"
              >
                <ScanBarcode className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Scan Barcode</span>
              </button>

              <div className="flex-1 flex gap-2">
                <form onSubmit={handleManualAdd} className="flex-1 flex gap-2">
                    <input 
                    type="text" 
                    value={manualBarcode}
                    onChange={(e) => setManualBarcode(e.target.value)}
                    placeholder="Type barcode..." 
                    className="flex-1 bg-white border border-gray-200 rounded-lg md:rounded-xl px-4 py-3 md:py-2 focus:ring-2 focus:ring-accent-500 focus:outline-none transition-shadow text-sm md:text-base shadow-sm"
                    />
                    <button type="submit" className="bg-accent-600 text-white px-6 rounded-lg md:rounded-xl hover:bg-accent-700 transition font-bold shadow-md hover:shadow-lg active:scale-95 text-sm md:text-base whitespace-nowrap border border-transparent">
                      Add
                    </button>
                </form>
              </div>
            </div>
          </div>

          {/* Product List */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 px-1">Stock List</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.length === 0 ? (
                <div className="col-span-full text-center py-10 text-gray-400 bg-cream rounded-xl border border-dashed border-orange-300">
                    No products in inventory yet. Scan to add one!
                </div>
              ) : (
                products.map((p) => (
                  <div key={p.barcode} className="bg-cream p-4 rounded-xl border border-orange-200 flex justify-between items-center hover:border-orange-300 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-gray-400 shrink-0 border border-orange-100">
                        <Package className="w-6 h-6" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-800 truncate pr-2">{p.name}</div>
                        <div className="text-xs text-gray-500 flex gap-2">
                           <span className="font-mono bg-orange-50 px-1 rounded border border-orange-100">#{p.barcode}</span>
                           <span>₹{p.price}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      {/* Professional Seller Theme Badge */}
                      <div className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                        p.stock > 0 
                          ? 'bg-orange-50 text-orange-700 border-orange-200' 
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {p.stock} left
                      </div>
                      
                      {/* Professional Add Button */}
                      <button 
                        onClick={() => incrementStock(p.barcode, 1)}
                        className="text-xs flex items-center gap-1.5 bg-white text-accent-700 border border-accent-200 hover:bg-accent-50 hover:border-accent-300 px-3 py-1.5 rounded-lg transition-all shadow-sm active:scale-95 font-semibold"
                      >
                        <Plus className="w-3 h-3" /> Add 1
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Orders View */}
      {activeTab === 'orders' && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {orders.length === 0 ? (
            <div className="text-center py-20 bg-cream rounded-2xl border border-dashed border-orange-300">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400 border border-orange-100">
                <ClipboardList className="w-8 h-8" />
              </div>
              <h3 className="text-gray-900 font-medium">No orders yet</h3>
              <p className="text-gray-500 text-sm">Waiting for customers...</p>
            </div>
          ) : (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {orders.map((order) => (
                <div key={order.id} className="bg-cream rounded-xl border border-orange-200 overflow-hidden hover:border-orange-300 transition-shadow">
                    <div className="p-4 border-b border-orange-100 flex justify-between items-start bg-orange-50/50">
                    <div>
                        <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-lg">#{order.id}</span>
                        {order.status === 'completed' ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 uppercase border border-green-200">Completed</span>
                        ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-accent-100 text-accent-700 uppercase border border-accent-200 animate-pulse">Pending</span>
                        )}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{new Date(order.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                        <div className="font-bold text-xl text-primary-700">₹{order.total}</div>
                        <div className="text-xs text-gray-500">{order.items.length} items</div>
                    </div>
                    </div>
                    
                    <div className="p-4">
                    <div className="space-y-2 mb-6 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                        {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm text-gray-700 py-1 border-b border-orange-100 last:border-0">
                            <span className="flex items-center gap-2">
                                <span className="font-bold text-gray-400">x{item.quantity}</span> 
                                {item.name}
                            </span>
                            <span className="text-gray-400 font-mono text-xs bg-white px-1 rounded border border-orange-100">#{item.barcode}</span>
                        </div>
                        ))}
                    </div>
                    
                    {order.status === 'pending' && (
                        <button 
                        onClick={() => {
                            setVerifyingOrderId(order.id);
                            setIsScannerOpen(true);
                        }}
                        className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition shadow-lg shadow-gray-200"
                        >
                        <Truck className="w-4 h-4" />
                        Verify Dispatch
                        </button>
                    )}
                    {order.status === 'completed' && (
                        <div className="w-full flex items-center justify-center gap-2 bg-green-50 text-green-600 py-3 rounded-lg text-sm font-medium border border-green-100">
                        <CheckCircle className="w-4 h-4" /> Dispatched Successfully
                        </div>
                    )}
                    </div>
                </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Scanners & Modals */}
      <ScannerModal 
        isOpen={isScannerOpen} 
        onClose={() => setIsScannerOpen(false)} 
        onScan={handleScanResult}
        title={verifyingOrderId ? "Scan any item to Verify" : "Scan to Add Stock"}
      />

      {/* New Product Modal */}
      {isNewProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-cream w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-orange-200 transform transition-all scale-100">
            <h3 className="text-xl font-bold text-gray-900 mb-2">New Product Found</h3>
            <p className="text-sm text-gray-500 mb-4">We couldn't find this barcode in the database.</p>
            
            <div className="mb-5 p-3 bg-yellow-50 text-yellow-800 rounded-lg text-sm border border-yellow-100 flex flex-col items-center">
              <span className="text-xs uppercase tracking-wider font-semibold text-yellow-600 mb-1">Scanned Barcode</span>
              <span className="font-mono text-xl font-bold tracking-widest">{newProductData.barcode}</span>
            </div>

            <form onSubmit={submitNewProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input 
                  required
                  autoFocus
                  type="text" 
                  value={newProductData.name}
                  onChange={e => setNewProductData({...newProductData, name: e.target.value})}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition-shadow"
                  placeholder="e.g. Britannia Cake"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                <input 
                  required
                  type="number" 
                  value={newProductData.price}
                  onChange={e => setNewProductData({...newProductData, price: e.target.value})}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition-shadow"
                  placeholder="0.00"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsNewProductModalOpen(false)} className="flex-1 py-3 text-gray-700 bg-orange-100 hover:bg-orange-200 rounded-xl font-medium transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-3 text-white bg-accent-600 hover:bg-accent-700 rounded-xl font-medium shadow-lg shadow-accent-200 transition-all hover:shadow-accent-300">Add Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopkeeperDashboard;