'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface TextureSelectorProps {
  onTextureChange: (texture: string) => void;
  currentTexture: string;
}

const textures = [
  'assets/drs-magazine-textures/DRS_MagazineTexture_8K_52.jpg',
  'assets/drs-magazine-textures/DRS_MagazineTexture_8K_53.jpg',
  'assets/drs-magazine-textures/DRS_MagazineTexture_8K_54.jpg',
  'assets/drs-magazine-textures/DRS_MagazineTexture_8K_55.jpg',
  'assets/drs-magazine-textures/DRS_MagazineTexture_8K_60.jpg',
  'assets/drs-magazine-textures/DRS_MagazineTexture_8K_62.jpg',
  'assets/drs-magazine-textures/DRS_MagazineTexture_8K_63.jpg',
  'assets/drs-magazine-textures/DRS_MagazineTexture_8K_66.jpg',
  'assets/drs-magazine-textures/DRS_MagazineTexture_8K_71.jpg',
  'assets/drs-magazine-textures/DRS_MagazineTexture_8K_81.jpg',
  'assets/drs-magazine-textures/DRS_MagazineTexture_8K_82.jpg',
  'assets/drs-magazine-textures/DRS_MagazineTexture_8K_84.jpg',
  'assets/drs-magazine-textures/DRS_MagazineTexture_8K_85.jpg',
];

export default function TextureSelector({ onTextureChange, currentTexture }: TextureSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors"
      >
        <div className="w-6 h-6 rounded overflow-hidden">
          <Image
            src={`/${currentTexture}`}
            alt="Current texture"
            width={24}
            height={24}
            className="w-full h-full object-cover"
          />
        </div>
        <span className="text-sm">Change Texture</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 z-50 min-w-[300px]">
          <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
            {textures.map(texture => (
              <button
                key={texture}
                onClick={() => {
                  onTextureChange(texture);
                  setIsOpen(false);
                }}
                className={`w-16 h-16 rounded overflow-hidden border-2 transition-all hover:scale-110 ${
                  currentTexture === texture ? 'border-purple-400' : 'border-white/20'
                }`}
              >
                <Image
                  src={`/${texture}`}
                  alt={`Texture ${texture}`}
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
