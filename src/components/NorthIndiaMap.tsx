import React from 'react';

export const NorthIndiaMap: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative w-full max-w-md mx-auto aspect-[4/3] bg-gradient-to-br from-[#f4f8f0] to-[#eaf3e5] rounded-2xl border border-[#6cb33f]/30 p-4 shadow-xs overflow-hidden ${className}`}>
      {/* Background Subtle Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#6cb33f_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />

      {/* SVG Map Illustration */}
      <svg
        viewBox="0 0 400 300"
        className="w-full h-full relative z-10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft Region Base Silhouettes */}
        {/* Himachal Pradesh Shape */}
        <path
          d="M 190 40 Q 220 30 250 50 Q 270 70 240 95 Q 210 90 190 70 Z"
          fill="#dcedd3"
          stroke="#b2d8a3"
          strokeWidth="1.5"
          className="transition-colors hover:fill-[#cbe7be]"
        />

        {/* Punjab Shape */}
        <path
          d="M 110 80 Q 150 70 175 100 Q 180 140 145 155 Q 110 145 100 115 Z"
          fill="#e4f1dc"
          stroke="#b2d8a3"
          strokeWidth="1.5"
        />

        {/* Uttarakhand Shape */}
        <path
          d="M 235 90 Q 280 85 295 120 Q 270 150 230 140 Q 230 110 235 90 Z"
          fill="#e4f1dc"
          stroke="#b2d8a3"
          strokeWidth="1.5"
        />

        {/* Haryana Shape */}
        <path
          d="M 145 145 Q 185 130 200 160 Q 215 200 180 230 Q 140 210 135 170 Z"
          fill="#d2eac4"
          stroke="#8cc776"
          strokeWidth="2"
        />

        {/* Delhi NCR Hub Highlight Oval */}
        <ellipse
          cx="195"
          cy="185"
          rx="32"
          ry="28"
          fill="#6cb33f"
          fillOpacity="0.2"
          stroke="#6cb33f"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />
        <circle cx="195" cy="185" r="16" fill="#6cb33f" fillOpacity="0.3" className="animate-pulse" />

        {/* Connecting Curved Expansion Flow Arrows */}
        {/* To Punjab */}
        <path
          d="M 185 175 Q 150 150 130 115"
          stroke="#3b711e"
          strokeWidth="2.5"
          strokeLinecap="round"
          markerEnd="url(#arrowhead)"
        />

        {/* To Himachal Pradesh */}
        <path
          d="M 195 165 Q 200 110 220 75"
          stroke="#3b711e"
          strokeWidth="2.5"
          strokeLinecap="round"
          markerEnd="url(#arrowhead)"
        />

        {/* To Uttarakhand */}
        <path
          d="M 210 175 Q 240 150 260 120"
          stroke="#3b711e"
          strokeWidth="2.5"
          strokeLinecap="round"
          markerEnd="url(#arrowhead)"
        />

        {/* To South Haryana / NCR Exp */}
        <path
          d="M 195 198 Q 205 240 215 260"
          stroke="#3b711e"
          strokeWidth="2.5"
          strokeLinecap="round"
          markerEnd="url(#arrowhead)"
        />

        {/* Arrow Marker Definition */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="4"
            orient="auto"
          >
            <polygon points="0 1, 8 4, 0 7" fill="#3b711e" />
          </marker>
        </defs>

        {/* PINS & LABELS */}
        {/* 1. HIMACHAL PRADESH */}
        <g transform="translate(205, 55)">
          <text
            x="20"
            y="5"
            fill="#0d1f15"
            fontSize="10"
            fontWeight="800"
            letterSpacing="0.05em"
            fontFamily="sans-serif"
          >
            HIMACHAL
          </text>
          <text
            x="20"
            y="16"
            fill="#0d1f15"
            fontSize="10"
            fontWeight="800"
            letterSpacing="0.05em"
            fontFamily="sans-serif"
          >
            PRADESH
          </text>
        </g>

        {/* 2. PUNJAB PIN & LABEL */}
        <g transform="translate(125, 105)">
          <circle cx="0" cy="0" r="10" fill="#0d1f15" />
          <circle cx="0" cy="0" r="4" fill="#6cb33f" />
          <text
            x="-65"
            y="4"
            fill="#0d1f15"
            fontSize="11"
            fontWeight="800"
            letterSpacing="0.05em"
            fontFamily="sans-serif"
          >
            PUNJAB
          </text>
        </g>

        {/* 3. UTTARAKHAND LABEL */}
        <g transform="translate(245, 120)">
          <circle cx="0" cy="0" r="9" fill="#0d1f15" />
          <circle cx="0" cy="0" r="3.5" fill="#6cb33f" />
          <text
            x="14"
            y="4"
            fill="#0d1f15"
            fontSize="10.5"
            fontWeight="800"
            letterSpacing="0.05em"
            fontFamily="sans-serif"
          >
            UTTARAKHAND
          </text>
        </g>

        {/* 4. HARYANA PIN & LABEL */}
        <g transform="translate(160, 185)">
          <circle cx="0" cy="0" r="11" fill="#0d1f15" />
          <circle cx="0" cy="0" r="4.5" fill="#fed100" />
          <text
            x="-62"
            y="4"
            fill="#0d1f15"
            fontSize="11"
            fontWeight="800"
            letterSpacing="0.05em"
            fontFamily="sans-serif"
          >
            HARYANA
          </text>
        </g>

        {/* 5. DELHI NCR PIN & LABEL (Central Hub) */}
        <g transform="translate(195, 185)">
          <circle cx="0" cy="0" r="13" fill="#0d1f15" stroke="#6cb33f" strokeWidth="2" />
          <circle cx="0" cy="0" r="5" fill="#6cb33f" />
          <text
            x="-32"
            y="32"
            fill="#0d1f15"
            fontSize="12"
            fontWeight="900"
            letterSpacing="0.05em"
            fontFamily="sans-serif"
          >
            DELHI NCR
          </text>
        </g>
      </svg>

      {/* Floating Badge */}
      <div className="absolute bottom-2.5 right-2.5 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-stone-200 shadow-2xs text-[10px] font-bold text-[#0d1f15] flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-[#6cb33f] animate-ping" />
        <span>50+ Stores Active</span>
      </div>
    </div>
  );
};
