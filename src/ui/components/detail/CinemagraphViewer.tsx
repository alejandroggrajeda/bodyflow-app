import React, { useState, useEffect } from 'react';
import { Play, Pause, Sparkles } from 'lucide-react';

interface CinemagraphViewerProps {
  images?: string[];
  fallbackUrl: string;
  alt: string;
}

export const CinemagraphViewer: React.FC<CinemagraphViewerProps> = ({
  images,
  fallbackUrl,
  alt,
}) => {
  const hasMultipleFrames = Array.isArray(images) && images.length >= 2;
  const [activeFrame, setActiveFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [loadedFrames, setLoadedFrames] = useState<Record<number, boolean>>({});
  const [fallbackLoaded, setFallbackLoaded] = useState(false);
  const [fallbackError, setFallbackError] = useState(false);

  // Automatic looping interval
  useEffect(() => {
    if (!hasMultipleFrames || !isPlaying) return;

    const interval = setInterval(() => {
      setActiveFrame((prev) => (prev + 1) % images!.length);
    }, 900);

    return () => clearInterval(interval);
  }, [hasMultipleFrames, isPlaying, images]);

  const handleFrameLoad = (index: number) => {
    setLoadedFrames((prev) => ({ ...prev, [index]: true }));
  };

  const handleStepClick = (index: number) => {
    setActiveFrame(index);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  return (
    <div className="relative w-full aspect-[4/3] bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800/80 shadow-2xl flex items-center justify-center group">
      {hasMultipleFrames ? (
        <>
          {/* Stacked preloaded image layers with crossfade */}
          {images!.map((src, index) => {
            const isVisible = activeFrame === index;
            const isLoaded = loadedFrames[index];

            return (
              <div
                key={src}
                className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${
                  isVisible ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                {!isLoaded && (
                  <div className="absolute inset-0 bg-zinc-900 animate-pulse flex items-center justify-center">
                    <span className="text-xs text-zinc-500 font-medium">
                      Cargando fotograma...
                    </span>
                  </div>
                )}
                <img
                  src={src}
                  alt={`${alt} - Fase ${index + 1}`}
                  loading="eager"
                  decoding="async"
                  onLoad={() => handleFrameLoad(index)}
                  className="w-full h-full object-contain p-2"
                />
              </div>
            );
          })}

          {/* Floating Controls Bar */}
          <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between gap-2 p-1.5 rounded-xl bg-zinc-950/85 backdrop-blur-md border border-zinc-800/90 shadow-lg">
            {/* Phase scrubbing buttons */}
            <div className="flex items-center gap-1.5 flex-1">
              <button
                type="button"
                onClick={() => handleStepClick(0)}
                data-active={activeFrame === 0}
                className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold transition-all text-center min-h-[36px] flex items-center justify-center gap-1.5 ${
                  activeFrame === 0
                    ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                    : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                <span>Paso 1: Inicio</span>
              </button>

              <button
                type="button"
                onClick={() => handleStepClick(1)}
                data-active={activeFrame === 1}
                className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold transition-all text-center min-h-[36px] flex items-center justify-center gap-1.5 ${
                  activeFrame === 1
                    ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                    : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                <span>Paso 2: Ejecución</span>
              </button>
            </div>

            {/* Play/Pause Button */}
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pausar animación' : 'Reproducir animación'}
              className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-emerald-400 transition-colors border border-zinc-800 min-h-[36px] min-w-[36px] flex items-center justify-center"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>
          </div>
        </>
      ) : (
        /* Fallback single asset */
        <div className="relative w-full h-full flex items-center justify-center">
          {!fallbackLoaded && !fallbackError && (
            <div className="absolute inset-0 bg-zinc-900 animate-pulse flex items-center justify-center">
              <span className="text-xs text-zinc-500 font-medium">
                Cargando animación...
              </span>
            </div>
          )}

          {fallbackError ? (
            <div className="flex flex-col items-center justify-center text-zinc-500 text-xs p-4 text-center">
              <Sparkles className="w-8 h-8 mb-2 text-zinc-600" />
              <span>Animación no disponible</span>
            </div>
          ) : (
            <img
              src={fallbackUrl}
              alt={alt}
              loading="lazy"
              decoding="async"
              onLoad={() => setFallbackLoaded(true)}
              onError={() => setFallbackError(true)}
              className={`w-full h-full object-contain p-2 transition-opacity duration-300 ${
                fallbackLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}
        </div>
      )}
    </div>
  );
};
