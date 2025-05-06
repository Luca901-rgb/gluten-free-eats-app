
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';

interface VideoPlayerProps {
  videoUrl: string;
  thumbnail?: string;
  title?: string;
  autoPlay?: boolean;
  onError?: (error: Error) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  thumbnail,
  title,
  autoPlay = false,
  onError
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const controlsTimeoutRef = useRef<number | null>(null);
  const playerRef = useRef<HTMLDivElement>(null);

  // Handle video loading metadata
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
    };

    const handleError = (e: Event) => {
      const error = new Error('Errore nel caricamento del video');
      setError(error);
      setIsLoading(false);
      if (onError) onError(error);
    };

    // Update current time
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    // Check for video end
    const handleEnded = () => {
      setIsPlaying(false);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('error', handleError);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    // Add fullscreen change event listeners
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    // Auto-play if set (with browser restrictions in mind)
    if (autoPlay) {
      video.play().catch(err => {
        console.error('Auto-play prevented:', err);
        setIsPlaying(false);
      });
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('error', handleError);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
      
      if (controlsTimeoutRef.current) {
        window.clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [videoUrl, onError, autoPlay]);

  // Toggle play/pause
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().catch(err => {
        console.error("Errore nella riproduzione:", err);
        toast.error("Impossibile riprodurre il video. Verifica la connessione internet.");
      });
      setIsPlaying(true);
    }
    
    // Show controls briefly when toggling play/pause
    showControlsTemporarily();
  };

  // Handle seek
  const handleSeek = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = value[0];
    video.currentTime = newTime;
    setCurrentTime(newTime);
    
    // Show controls briefly when seeking
    showControlsTemporarily();
  };

  // Toggle mute
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(!isMuted);
    
    // Show controls briefly
    showControlsTemporarily();
  };

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = value[0];
    video.volume = newVolume;
    setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
      video.muted = true;
    } else if (isMuted) {
      setIsMuted(false);
      video.muted = false;
    }
    
    // Show controls briefly
    showControlsTemporarily();
  };

  // Skip backward 10 seconds
  const skipBackward = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.currentTime = Math.max(0, video.currentTime - 10);
    
    // Show controls briefly
    showControlsTemporarily();
  };

  // Skip forward 10 seconds
  const skipForward = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.currentTime = Math.min(video.duration, video.currentTime + 10);
    
    // Show controls briefly
    showControlsTemporarily();
  };

  // Handle fullscreen
  const toggleFullscreen = () => {
    if (!playerRef.current) return;
    
    try {
      if (!isFullscreen) {
        if (playerRef.current.requestFullscreen) {
          playerRef.current.requestFullscreen();
        } else if ((playerRef.current as any).webkitRequestFullscreen) {
          (playerRef.current as any).webkitRequestFullscreen();
        } else if ((playerRef.current as any).mozRequestFullScreen) {
          (playerRef.current as any).mozRequestFullScreen();
        } else if ((playerRef.current as any).msRequestFullscreen) {
          (playerRef.current as any).msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          (document as any).msExitFullscreen();
        }
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
    
    // Show controls briefly
    showControlsTemporarily();
  };

  // Format time (seconds to MM:SS)
  const formatTime = (time: number): string => {
    if (!isFinite(time) || time < 0) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle fullscreen change
  const handleFullscreenChange = () => {
    const isCurrentlyFullscreen = !!(
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).mozFullScreenElement ||
      (document as any).msFullscreenElement
    );
    
    setIsFullscreen(isCurrentlyFullscreen);
  };

  // Show controls temporarily and hide after delay
  const showControlsTemporarily = () => {
    setIsControlsVisible(true);
    
    if (controlsTimeoutRef.current) {
      window.clearTimeout(controlsTimeoutRef.current);
    }
    
    if (isPlaying && !isHovering) {
      controlsTimeoutRef.current = window.setTimeout(() => {
        setIsControlsVisible(false);
      }, 3000);
    }
  };

  // Mouse events for controls visibility
  const handleMouseEnter = () => {
    setIsHovering(true);
    setIsControlsVisible(true);
    
    if (controlsTimeoutRef.current) {
      window.clearTimeout(controlsTimeoutRef.current);
    }
  };
  
  const handleMouseLeave = () => {
    setIsHovering(false);
    
    if (isPlaying && controlsTimeoutRef.current === null) {
      controlsTimeoutRef.current = window.setTimeout(() => {
        setIsControlsVisible(false);
        controlsTimeoutRef.current = null;
      }, 3000);
    }
  };
  
  const handleMouseMove = () => {
    showControlsTemporarily();
  };

  // Determine if the video is playable or if we should show an error/thumbnail
  const isVideoReady = !isLoading && !error;
  const showThumbnail = !isVideoReady || (!isPlaying && thumbnail);

  return (
    <div 
      ref={playerRef} 
      className={`relative rounded-lg overflow-hidden bg-black group ${isFullscreen ? 'w-full h-full' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {/* Video or Thumbnail */}
      <div className="relative aspect-video">
        {showThumbnail && thumbnail && (
          <div 
            className="absolute inset-0 bg-center bg-cover cursor-pointer" 
            style={{ backgroundImage: `url(${thumbnail})` }}
            onClick={togglePlay}
          >
            <div className="absolute inset-0 bg-black opacity-40"></div>
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Button 
                  className="rounded-full w-16 h-16 bg-primary/90 hover:bg-primary" 
                  onClick={togglePlay}
                >
                  <Play className="h-8 w-8 text-white" />
                </Button>
              </div>
            )}
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/80">
            <p className="text-red-400 mb-2">Errore nel caricamento del video</p>
            <p className="text-sm text-gray-400">Verifica che l'URL sia corretto e riprova</p>
          </div>
        )}

        <video
          ref={videoRef}
          src={videoUrl}
          className={`w-full h-full object-contain ${showThumbnail ? 'invisible' : 'visible'} cursor-pointer`}
          poster={thumbnail}
          onClick={togglePlay}
          preload="metadata"
          playsInline
        />
      </div>

      {/* Big Play/Pause button overlay (shows only when controls are visible) */}
      {isControlsVisible && isPlaying && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-transparent cursor-pointer"
          onClick={togglePlay}
        >
          {/* Hidden transparent div for play/pause functionality */}
        </div>
      )}

      {/* Controls - Visible conditionally */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 transition-opacity duration-300 ${
          isControlsVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Title (if provided) */}
        {title && (
          <div className="mb-2 text-white text-sm font-medium">
            {title}
          </div>
        )}
        
        {/* Progress bar */}
        <div className="mb-2">
          <Slider
            value={[currentTime]}
            min={0}
            max={duration || 100}
            step={0.1}
            onValueChange={handleSeek}
            className="cursor-pointer"
          />
        </div>
        
        {/* Control buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/20"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/20"
              onClick={skipBackward}
            >
              <SkipBack size={18} />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/20"
              onClick={skipForward}
            >
              <SkipForward size={18} />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/20"
              onClick={toggleMute}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </Button>
            
            <div className="hidden sm:block sm:w-24 ml-2">
              <Slider
                value={[isMuted ? 0 : volume]}
                min={0}
                max={1}
                step={0.1}
                onValueChange={handleVolumeChange}
              />
            </div>
            
            <span className="text-white text-xs ml-2">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-white/20"
            onClick={toggleFullscreen}
          >
            <Maximize size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
