import React from 'react';
import { Star, Clock, MapPin, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const StoreSelection: React.FC = () => {
  const { stores, selectStore } = useStore();

  return (
    <div className="max-w-5xl mx-auto py-6 md:py-8">
      <div className="text-center mb-8 md:mb-10 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Select a Store Nearby</h2>
        <p className="text-gray-500 text-sm md:text-base">Choose a Kirana store to start shopping</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {stores.map((store) => (
          <button
            key={store.id}
            onClick={() => selectStore(store.id)}
            className="group relative bg-cream rounded-2xl overflow-hidden border border-orange-200 hover:border-orange-300 transition-all duration-300 flex flex-col text-left h-full hover:-translate-y-1 shadow-sm hover:shadow-md"
          >
            {/* Glowing Corner Accent (Over Image) */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary-50/90 rounded-bl-full -mr-8 -mt-8 transition-all duration-500 group-hover:bg-primary-200/90 group-hover:scale-125 group-hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] z-20 backdrop-blur-[2px]"></div>

            <div className="relative h-40 md:h-48 overflow-hidden z-0">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10"></div>
              <img 
                src={store.image} 
                alt={store.name} 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              {/* Rating Badge - Moved to Bottom Right */}
              <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 z-20 bg-cream/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm border border-orange-100">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                {store.rating}
              </div>
            </div>

            <div className="p-4 md:p-5 flex-1 flex flex-col relative z-10">
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
                {store.name}
              </h3>
              
              <div className="flex items-center gap-4 text-xs md:text-sm text-gray-500 mt-2 mb-4 md:mb-6">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  {store.deliveryTime}
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  0.5 km
                </div>
              </div>

              <div className="mt-auto flex items-center justify-between text-primary-600 font-medium text-xs md:text-sm border-t border-orange-100 pt-3 md:pt-4">
                Visit Store
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-orange-100 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-all">
                  <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StoreSelection;