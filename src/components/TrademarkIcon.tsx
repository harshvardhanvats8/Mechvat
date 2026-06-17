import React from "react";

interface TrademarkIconProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

export default function TrademarkIcon({ className = "", size = 48, glow = true }: TrademarkIconProps) {
  return (
    <div 
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
      id="mechvat-brand-trademark"
    >
      {/* Absolute futuristic ambient glow background */}
      {glow && (
        <div 
          className="absolute inset-0 rounded-xl bg-blue-500/20 blur-md pointer-events-none animate-pulse"
          style={{ transform: "scale(1.15)" }}
        />
      )}

      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative"
      >
        {/* Outer Circular High-Pressure Chamber Ring (Vat Body) */}
        <circle 
          cx="50" 
          cy="50" 
          r="45" 
          stroke="url(#vatCoreEdge)" 
          strokeWidth="3.5" 
          strokeDasharray="10 4 2 4"
          className="animate-spin-slow origin-center"
        />

        {/* Industrial Measurement Ticks on Chamber Edge */}
        <circle
          cx="50"
          cy="50"
          r="41"
          stroke="currentColor"
          className="text-blue-500/30"
          strokeWidth="1"
          strokeDasharray="2 6"
        />

        {/* Inner Chamber fluid / chemical induction level */}
        <path
          d="M 15 50 Q 30 45, 50 50 T 85 50 A 35 35 0 0 1 15 50"
          fill="url(#vatLiquid)"
          opacity="0.35"
          className="animate-pulse"
        />

        {/* Shifting Mechanical Gear & Spur Assembly Inside the Vat */}
        <g transform="translate(50, 48)">
          <g className="animate-spin-reverse origin-center">
            {/* Gear Outline */}
            <circle cx="0" cy="0" r="16" stroke="url(#gearMetallic)" strokeWidth="2.5" />
            <circle cx="0" cy="0" r="11" fill="url(#metalDarkCenter)" />
            
            {/* Gear Teeth (12 radial keys) */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, idx) => (
              <rect
                key={idx}
                x="-3"
                y="-19"
                width="6"
                height="5"
                rx="1"
                fill="url(#gearMetallic)"
                transform={`rotate(${angle})`}
              />
            ))}
          </g>

          {/* Central Core Nuclear Reactor Chamber Axis or Piston Pin */}
          <circle cx="0" cy="0" r="6" stroke="#00f0ff" strokeWidth="1.5" fill="#030712" />
          <circle cx="0" cy="0" r="2.5" fill="#38bdf8" className="animate-ping" />
        </g>

        {/* Thermodynamic Vector Arrow Injection Indicators */}
        <path 
          d="M 50 4 L 50 15 M 50 96 L 50 85 M 4 50 L 15 50 M 96 50 L 85 50" 
          stroke="#38bdf8" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
        />

        {/* Glowing Fusion Electrodes */}
        <circle cx="50" cy="7" r="2" fill="#00f0ff" />
        <circle cx="50" cy="93" r="2" fill="#00f0ff" />
        <circle cx="7" cy="50" r="2" fill="#00f0ff" />
        <circle cx="93" cy="50" r="2" fill="#00f0ff" />

        {/* Gradients */}
        <defs>
          <linearGradient id="vatCoreEdge" x1="0" y1="0" x2="100" y2="100">
            <stop offset="0%" stopColor="#00f0ff" />
            <stop offset="50%" stopColor="#1d4ed8" />
            <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.2" />
          </linearGradient>

          <linearGradient id="gearMetallic" x1="-15" y1="-15" x2="15" y2="15">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#00f0ff" />
          </linearGradient>

          <linearGradient id="vatLiquid" x1="50" y1="40" x2="50" y2="90">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.1" />
          </linearGradient>

          <radialGradient id="metalDarkCenter" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#030712" />
            <stop offset="100%" stopColor="#1f2937" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}
