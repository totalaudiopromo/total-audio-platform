import React from 'react';

interface TextureOverlayProps {
  textureType?: 'paper' | 'grain' | 'luma';
  textureVariant?: number;
  blendMode?: 'overlay' | 'multiply' | 'soft-light' | 'screen';
  opacity?: number;
  className?: string;
  children?: React.ReactNode;
}

const textureMap = {
  paper: [
    '/textures/DRS_MagazineTexture_8K_81.jpg',
    '/textures/DRS_MagazineTexture_8K_82.jpg',
    '/textures/DRS_MagazineTexture_8K_84.jpg',
    '/textures/DRS_MagazineTexture_8K_85.jpg',
  ],
  grain: [
    '/textures/DRS_MagazineTexture_8K_52.jpg',
    '/textures/DRS_MagazineTexture_8K_53.jpg',
    '/textures/DRS_MagazineTexture_8K_54.jpg',
    '/textures/DRS_MagazineTexture_8K_55.jpg',
  ],
  luma: [
    '/textures/DRS_4K_Luma Gradient_01.jpg',
    '/textures/DRS_4K_Luma Gradient_02.jpg',
    '/textures/DRS_4K_Luma Gradient_03.jpg',
    '/textures/DRS_4K_Luma Gradient_04.jpg',
    '/textures/DRS_4K_Luma Gradient_05.jpg',
  ],
};

const blendModeClasses = {
  overlay: 'mix-blend-overlay',
  multiply: 'mix-blend-multiply',
  'soft-light': 'mix-blend-soft-light',
  screen: 'mix-blend-screen',
};

export const TextureOverlay: React.FC<TextureOverlayProps> = ({
  textureType = 'paper',
  textureVariant = 1,
  blendMode = 'overlay',
  opacity = 0.15,
  className = '',
  children,
}) => {
  const textureUrl = textureMap[textureType][(textureVariant - 1) % textureMap[textureType].length];
  const blendClass = blendModeClasses[blendMode];

  // CSS-only texture fallback classes
  const cssTextureClass =
    textureType === 'paper'
      ? 'texture-paper-css'
      : textureType === 'grain'
      ? 'texture-grain-css'
      : 'texture-luma-css';

  return (
    <div className={`relative ${className}`}>
      {children}
      <div
        className={`absolute inset-0 pointer-events-none ${blendClass} ${cssTextureClass}`}
        style={{
          backgroundImage: `url(${textureUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: opacity,
          willChange: 'transform',
        }}
        onError={e => {
          // Fallback to CSS-only texture if image fails to load
          const target = e.target as HTMLDivElement;
          target.style.backgroundImage = 'none';
          target.classList.add(cssTextureClass);
        }}
      />
    </div>
  );
};

export const TextureBackground: React.FC<TextureOverlayProps> = ({
  textureType = 'paper',
  textureVariant = 1,
  blendMode = 'overlay',
  opacity = 0.08,
  className = '',
  children,
}) => {
  const textureUrl = textureMap[textureType][(textureVariant - 1) % textureMap[textureType].length];
  const blendClass = blendModeClasses[blendMode];

  // CSS-only texture fallback classes
  const cssTextureClass =
    textureType === 'paper'
      ? 'texture-paper-css'
      : textureType === 'grain'
      ? 'texture-grain-css'
      : 'texture-luma-css';

  return (
    <div
      className={`relative ${className} ${cssTextureClass}`}
      style={{
        backgroundImage: `url(${textureUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        willChange: 'transform',
      }}
      onError={e => {
        // Fallback to CSS-only texture if image fails to load
        const target = e.target as HTMLDivElement;
        target.style.backgroundImage = 'none';
        target.classList.add(cssTextureClass);
      }}
    >
      <div
        className={`absolute inset-0 ${blendClass}`}
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          opacity: 1 - opacity,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export const TextureCard: React.FC<{
  textureType?: 'paper' | 'grain' | 'luma';
  textureVariant?: number;
  rotation?: number;
  className?: string;
  children?: React.ReactNode;
  floating?: boolean;
  entrance?: boolean;
}> = ({
  textureType = 'paper',
  textureVariant = 1,
  rotation = 0,
  className = '',
  children,
  floating = false,
  entrance = true,
}) => {
  const textureUrl = textureMap[textureType][(textureVariant - 1) % textureMap[textureType].length];

  const baseClasses =
    'relative bg-white rounded-xl shadow-texture-soft transition-all duration-500 ease-out overflow-hidden';
  const animationClasses = floating
    ? 'animate-texture-float'
    : entrance
    ? 'animate-texture-entrance'
    : '';

  // CSS-only texture fallback classes
  const cssTextureClass =
    textureType === 'paper'
      ? 'texture-paper-css'
      : textureType === 'grain'
      ? 'texture-grain-css'
      : 'texture-luma-css';

  return (
    <div
      className={`${baseClasses} ${animationClasses} ${className} ${cssTextureClass}`}
      style={{
        backgroundImage: `url(${textureUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        transform: `rotate(${rotation}deg)`,
        willChange: 'transform',
      }}
      onError={e => {
        // Fallback to CSS-only texture if image fails to load
        const target = e.target as HTMLDivElement;
        target.style.backgroundImage = 'none';
        target.classList.add(cssTextureClass);
      }}
    >
      <div className="absolute inset-0 bg-white/90" />
      <div className="relative z-10">{children}</div>
    </div>
  );
};
