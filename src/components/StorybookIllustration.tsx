import React, { useState } from 'react';
import { KikoExplorerIllustration, WorldEmblemSvg } from './MascotIllustrations';
import { WorldId } from '../types/game';

interface StorybookIllustrationProps {
  src: string;
  alt: string;
  fallbackGradient: string;
  worldId?: WorldId;
  className?: string;
  imgClassName?: string;
}

export const StorybookIllustration: React.FC<StorybookIllustrationProps> = ({
  src,
  alt,
  fallbackGradient,
  worldId,
  className = '',
  imgClassName = 'w-full h-full object-cover',
}) => {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`bg-gradient-to-br ${fallbackGradient} flex flex-col items-center justify-center p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        {worldId ? (
          <WorldEmblemSvg worldId={worldId} className="w-16 h-16 mb-2" />
        ) : (
          <KikoExplorerIllustration className="w-36 h-36" />
        )}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${fallbackGradient} ${className}`}>
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className={imgClassName}
      />
    </div>
  );
};
