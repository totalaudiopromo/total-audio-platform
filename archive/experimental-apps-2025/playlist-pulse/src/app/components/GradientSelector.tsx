'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface GradientSelectorProps {
  onGradientChange: (gradient: string) => void;
  currentGradient: string;
}

const gradients = [
  'assets/drs-luma-gradients/DRS_4K_Luma Gradient_01.jpg',
  'assets/drs-luma-gradients/DRS_4K_Luma Gradient_02.jpg',
  'assets/drs-luma-gradients/DRS_4K_Luma Gradient_03.jpg',
  'assets/drs-luma-gradients/DRS_4K_Luma Gradient_04.jpg',
  'assets/drs-luma-gradients/DRS_4K_Luma Gradient_05.jpg',
  'assets/drs-luma-gradients/DRS_4K_Luma Gradient_06.jpg',
  'assets/drs-luma-gradients/DRS_4K_Luma Gradient_07.jpg',
  'assets/drs-luma-gradients/DRS_4K_Luma Gradient_08.jpg',
  'assets/drs-luma-gradients/DRS_4K_Luma Gradient_09.jpg',
  'assets/drs-luma-gradients/DRS_4K_Luma Gradient_10.jpg',
  'assets/drs-luma-gradients/DRS_4K_Luma Gradient_11.jpg',
  'assets/drs-luma-gradients/DRS_4K_Luma Gradient_12.jpg',
  'assets/drs-luma-gradients/DRS_4K_Luma Gradient_13.jpg',
  'assets/drs-luma-gradients/DRS_4K_Luma Gradient_14.jpg',
  'assets/drs-luma-gradients/DRS_4K_Luma Gradient_15.jpg',
  'assets/drs-luma-gradients/DRS_4K_Luma Gradient_16.jpg',
  'assets/drs-luma-gradients/DRS_4K_Luma Gradient_17.jpg',
  'assets/drs-luma-gradients/DRS_4K_Luma Gradient_18.jpg',
  'assets/drs-luma-gradients/DRS_4K_Luma Gradient_19.jpg',
  'assets/drs-luma-gradients/DRS_4K_Luma Gradient_20.jpg',
  'assets/drs-luma-gradients/DRS_4K_Luma Gradient_22.jpg',
  'assets/drs-luma-gradients/DRS_4K_Luma Gradient_23.jpg',
  'assets/drs-luma-gradients/DRS_4K_Luma Gradient_24.jpg',
  'assets/drs-luma-gradients/DRS_4K_Luma Gradient_25.jpg',
  'assets/drs-luma-gradients/DRS_4K_Luma Gradient_26.jpg',
  'assets/drs-luma-gradients/DRS_4K_Luma Gradient_27.jpg',
  'assets/drs-luma-gradients/DRS_4K_Luma Gradient_28.jpg',
  'assets/drs-luma-gradients/DRS_4K_Luma Gradient_29.jpg',
  'assets/drs-luma-gradients/DRS_4K_Luma Gradient_30.jpg',
  'assets/drs-luma-gradients/DRS_4K_Luma Gradient_31.jpg',
  'assets/drs-luma-gradients/DRS_4K_Luma Gradient_32.jpg',
  'assets/drs-luma-gradients/DRS_4K_Luma Gradient_33.jpg',
  'assets/drs-luma-gradients/DRS_4K_Luma Gradient_34.jpg',
  'assets/drs-luma-gradients/DRS_4K_Luma Gradient_35.jpg',
];

export default function GradientSelector({
  onGradientChange,
  currentGradient,
}: GradientSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors"
      >
        <div className="w-6 h-6 rounded overflow-hidden">
          <Image
            src={`/${currentGradient}`}
            alt="Current gradient"
            width={24}
            height={24}
            className="w-full h-full object-cover"
          />
        </div>
        <span className="text-sm">Change Background</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 z-50 min-w-[300px]">
          <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
            {gradients.map(gradient => (
              <button
                key={gradient}
                onClick={() => {
                  onGradientChange(gradient);
                  setIsOpen(false);
                }}
                className={`w-16 h-16 rounded overflow-hidden border-2 transition-all hover:scale-110 ${
                  currentGradient === gradient ? 'border-purple-400' : 'border-white/20'
                }`}
              >
                <Image
                  src={`/${gradient}`}
                  alt={`Gradient ${gradient}`}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
