import React, { useState } from 'react';
import { Navigation, ChevronRight } from 'lucide-react';
import { StoreItem } from '../pages/LocationsPage';

interface DelhiNcrNetworkMapProps {
  stores: StoreItem[];
  onSelectStore: (store: StoreItem) => void;
}

export const DelhiNcrNetworkMap: React.FC<DelhiNcrNetworkMapProps> = ({ stores, onSelectStore }) => {
  const [hoveredPin, setHoveredPin] = useState<string | null>('loc-109');

  // Interactive store pins coordinates on a 500x420 coordinate grid
  const pinPoints = [
    { id: 'loc-109', name: 'Sector 109 Hub', x: 220, y: 260, isHub: true, city: 'Gurugram' },
    { id: 'loc-dwarka-hub', name: 'Dwarka Expressway Hub', x: 200, y: 215, isHub: true, city: 'Gurugram' },
    { id: 'loc-kmp', name: 'KMP Expressway Store', x: 110, y: 310, isHub: false, city: 'Haryana' },
    { id: 'loc-sec56', name: 'Sector 56 Market', x: 275, y: 295, isHub: false, city: 'Gurugram' },
    { id: 'loc-sohna', name: 'Sohna Road Hub', x: 240, y: 345, isHub: false, city: 'Gurugram' },
    { id: 'loc-golf-course', name: 'Golf Course Ext.', x: 260, y: 275, isHub: false, city: 'Gurugram' },
    // Surrounding NCR reference nodes
    { id: 'ref-delhi', name: 'Central Delhi', x: 305, y: 175, isRef: true, city: 'New Delhi' },
    { id: 'ref-noida', name: 'Noida Hub (Upcoming)', x: 390, y: 210, isRef: true, city: 'Noida' },
    { id: 'ref-ghaziabad', name: 'Ghaziabad', x: 410, y: 155, isRef: true, city: 'UP' },
    { id: 'ref-bahadurgarh', name: 'Bahadurgarh', x: 135, y: 165, isRef: true, city: 'Haryana' },
    { id: 'ref-faridabad', name: 'Faridabad Express', x: 340, y: 315, isRef: true, city: 'Faridabad' },
  ];

  const activePinData = pinPoints.find(p => p.id === hoveredPin) || pinPoints[0];
  const matchedStore = stores.find(s => s.id === activePinData.id) || stores[0];

  return (
    <div className="relative rounded-2xl overflow-hidden border border-stone-200 bg-[#f7faf5] shadow-xs select-none">
      {/* Search Overlay Header matching PDF */}
      <div className="p-3 bg-white/95 backdrop-blur-md border-b border-stone-200/80 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-stone-700">
          <Navigation className="w-3.5 h-3.5 text-[#3b711e]" />
          <span>Interactive NCR Store Locator</span>
        </div>
        <span className="text-[10px] font-black uppercase tracking-wider bg-[#d9f2c8] text-[#0d1f15] px-2 py-0.5 rounded-full">
          Live GPS Network
        </span>
      </div>

      {/* SVG Canvas */}
      <div className="relative h-80 sm:h-96 w-full overflow-hidden bg-gradient-to-b from-[#f9fbf8] to-[#edf4e8]">
        {/* Subtle Map Grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#6cb33f0a_1px,transparent_1px),linear-gradient(to_bottom,#6cb33f0a_1px,transparent_1px)] bg-[size:24px_24px]" />

        <svg viewBox="0 0 500 420" className="w-full h-full relative z-10" fill="none">
          {/* Major Highway Corridors */}
          {/* NH48 Highway */}
          <path
            d="M 305 175 L 220 260 L 160 380"
            stroke="#9ac882"
            strokeWidth="5"
            strokeLinecap="round"
            strokeOpacity="0.4"
          />
          <path
            d="M 305 175 L 220 260 L 160 380"
            stroke="#6cb33f"
            strokeWidth="2"
            strokeDasharray="4 4"
          />

          {/* Dwarka Expressway Corridor */}
          <path
            d="M 270 170 Q 210 180 200 215 Q 190 245 220 260"
            stroke="#3b711e"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeOpacity="0.7"
          />

          {/* KMP Expressway Outer Ring */}
          <path
            d="M 120 120 Q 90 220 110 310 Q 150 390 260 410"
            stroke="#b3d89d"
            strokeWidth="3"
            strokeDasharray="6 4"
          />

          {/* Noida - Delhi Link */}
          <path
            d="M 305 175 Q 350 190 390 210"
            stroke="#9ac882"
            strokeWidth="3"
            strokeOpacity="0.4"
          />

          {/* Highway Highway Badges */}
          <rect x="235" y="210" width="36" height="15" rx="3" fill="#fed100" />
          <text x="240" y="221" fontSize="9" fontWeight="900" fill="#0d1f15" fontFamily="sans-serif">
            NH 48
          </text>

          <rect x="155" y="240" width="46" height="15" rx="3" fill="#6cb33f" />
          <text x="158" y="251" fontSize="8" fontWeight="800" fill="#ffffff" fontFamily="sans-serif">
            DWARKA EXP
          </text>

          <rect x="75" y="250" width="34" height="15" rx="3" fill="#0d1f15" />
          <text x="80" y="261" fontSize="8" fontWeight="800" fill="#ffffff" fontFamily="sans-serif">
            KMP
          </text>

          {/* City District Background Badges */}
          <text x="285" y="160" fontSize="13" fontWeight="900" fill="#5a7061" fontFamily="sans-serif" letterSpacing="0.05em">
            New Delhi
          </text>
          <text x="200" y="295" fontSize="14" fontWeight="900" fill="#2d5c16" fontFamily="sans-serif" letterSpacing="0.05em">
            Gurugram
          </text>
          <text x="390" y="235" fontSize="11" fontWeight="800" fill="#7d9183" fontFamily="sans-serif">
            Noida
          </text>
          <text x="400" y="150" fontSize="11" fontWeight="800" fill="#7d9183" fontFamily="sans-serif">
            Ghaziabad
          </text>
          <text x="110" y="160" fontSize="11" fontWeight="800" fill="#7d9183" fontFamily="sans-serif">
            Bahadurgarh
          </text>

          {/* Active Store Coverage Halo around Gurugram Hub */}
          <circle cx="220" cy="260" r="42" fill="#6cb33f" fillOpacity="0.12" stroke="#6cb33f" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="220" cy="260" r="24" fill="#6cb33f" fillOpacity="0.2" className="animate-pulse" />

          {/* PINS */}
          {pinPoints.map((pin) => {
            const isHovered = hoveredPin === pin.id;
            const isStore = !pin.isRef;

            return (
              <g
                key={pin.id}
                transform={`translate(${pin.x}, ${pin.y})`}
                className="cursor-pointer transition-all duration-300 group"
                onClick={() => isStore && onSelectStore(matchedStore)}
                onMouseEnter={() => setHoveredPin(pin.id)}
              >
                {/* Ping ring for main hub */}
                {pin.isHub && (
                  <circle cx="0" cy="-6" r="14" fill="#6cb33f" fillOpacity="0.4" className="animate-ping" />
                )}

                {/* Pin Shadow */}
                <ellipse cx="0" cy="2" rx="6" ry="2.5" fill="#000000" fillOpacity="0.25" />

                {/* Custom VillageDELI Pin Shape */}
                <path
                  d="M 0 0 C -7 -10, -9 -18, 0 -22 C 9 -18, 7 -10, 0 0 Z"
                  fill={isHovered ? '#6cb33f' : isStore ? '#0d1f15' : '#738a7c'}
                  stroke={isHovered ? '#0d1f15' : '#ffffff'}
                  strokeWidth="1.5"
                />

                {/* Inner Icon Dot / Clock Logo Symbol */}
                <circle cx="0" cy="-14" r="4" fill={isHovered ? '#ffffff' : pin.isHub ? '#6cb33f' : '#fed100'} />

                {/* Pin Tooltip Label */}
                <g transform="translate(0, -28)">
                  <rect
                    x={-((pin.name.length * 5.5) / 2) - 6}
                    y="-11"
                    width={pin.name.length * 5.5 + 12}
                    height="14"
                    rx="4"
                    fill={isHovered ? '#0d1f15' : '#ffffff'}
                    stroke={isHovered ? '#6cb33f' : '#b2c8a7'}
                    strokeWidth="1"
                    className="shadow-md"
                  />
                  <text
                    x="0"
                    y="-1"
                    textAnchor="middle"
                    fill={isHovered ? '#ffffff' : '#0d1f15'}
                    fontSize="8.5"
                    fontWeight="800"
                    fontFamily="sans-serif"
                  >
                    {pin.name}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {/* Floating Quick Action Footer Card */}
        <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md rounded-xl p-3 border border-stone-200 shadow-md flex items-center justify-between text-xs z-20">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#6cb33f] animate-ping" />
            <div>
              <span className="font-bold text-stone-900 block leading-tight">
                {matchedStore.name}
              </span>
              <span className="text-[10px] text-stone-500 font-medium">
                {matchedStore.address}
              </span>
            </div>
          </div>
          <button
            onClick={() => onSelectStore(matchedStore)}
            className="text-[#3b711e] hover:text-[#0d1f15] font-black text-xs flex items-center gap-1 shrink-0 bg-[#eef5ea] px-3 py-1.5 rounded-lg border border-[#6cb33f]/30 transition-colors"
          >
            <span>View Details</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
