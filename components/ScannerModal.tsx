import React, { useEffect, useState } from 'react';
import { X, ScanLine, Camera } from 'lucide-react';

interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (barcode: string) => void;
  title?: string;
}

const ScannerModal: React.FC<ScannerModalProps> = ({ isOpen, onClose, onScan, title = "Scan Barcode" }) => {
  const [scanning, setScanning] = useState(false);
  const [simulatedCode, setSimulatedCode] = useState('');

  useEffect(() => {
    if (isOpen) {
      setScanning(true);
      setSimulatedCode('');
    } else {
      setScanning(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSimulateScan = () => {
    // Simulate a delay then scan a random or specific code
    // For demo purposes, we can provide buttons to scan specific existing items or a new one
    // In a real mock, this might be random.
    setScanning(false);
    // Let's just pass a manual code from the buttons below for better UX testing
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="bg-cream w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative border border-orange-200">
        
        {/* Header */}
        <div className="p-4 bg-gray-900 text-white flex justify-between items-center">
          <h3 className="font-semibold flex items-center gap-2">
            <Camera className="w-5 h-5" />
            {title}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder */}
        <div className="relative aspect-square bg-gray-800 flex items-center justify-center overflow-hidden group">
          {/* Simulated Camera Feed */}
          <div className="absolute inset-0 opacity-40 bg-[url('https://picsum.photos/600/600')] bg-cover bg-center mix-blend-overlay"></div>
          
          {/* Scanning Animation */}
          <div className="absolute inset-8 border-2 border-primary-500/50 rounded-lg">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full h-0.5 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
            </div>
            {/* Corners */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary-500 -mt-1 -ml-1"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary-500 -mt-1 -mr-1"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary-500 -mb-1 -ml-1"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary-500 -mb-1 -mr-1"></div>
          </div>
          
          <div className="z-10 text-white/80 text-sm font-medium animate-pulse">
            Align barcode within frame
          </div>
        </div>

        {/* Controls (Simulation) */}
        <div className="p-6 bg-cream space-y-4">
          <p className="text-xs text-gray-500 text-center uppercase tracking-wider font-semibold">
            Developer Mode: Simulate Scan
          </p>
          
          <div className="grid grid-cols-2 gap-2">
             <button 
               onClick={() => onScan('1111')}
               className="px-3 py-2 text-xs bg-orange-100 hover:bg-orange-200 rounded text-gray-700 font-medium"
             >
               Scan "Maggi" (1111)
             </button>
             <button 
               onClick={() => onScan('2222')}
               className="px-3 py-2 text-xs bg-orange-100 hover:bg-orange-200 rounded text-gray-700 font-medium"
             >
               Scan "Milk" (2222)
             </button>
             <button 
               onClick={() => onScan('9999')}
               className="px-3 py-2 text-xs bg-accent-50 hover:bg-accent-100 text-accent-600 rounded font-medium border border-accent-200"
             >
               Scan New Item (9999)
             </button>
             <button 
               onClick={() => onScan(Math.floor(Math.random() * 10000).toString())}
               className="px-3 py-2 text-xs bg-orange-100 hover:bg-orange-200 rounded text-gray-700 font-medium"
             >
               Scan Random
             </button>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100px); opacity: 0; }
          20% { opacity: 1; }
          50% { transform: translateY(0); }
          80% { opacity: 1; }
          100% { transform: translateY(100px); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default ScannerModal;