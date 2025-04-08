
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

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('error', handleError);
    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('error', handleError);
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [videoUrl, onError]);

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
  };

  // Handle seek
  const handleSeek = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = value[0];
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Toggle mute
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(!isMuted);
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
  };

  // Skip backward 10 seconds
  const skipBackward = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.currentTime = Math.max(0, video.currentTime - 10);
  };

  // Skip forward 10 seconds
  const skipForward = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.currentTime = Math.min(video.duration, video.currentTime + 10);
  };

  // Enter fullscreen
  const enterFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.requestFullscreen) {
      video.requestFullscreen();
    }
  };

  // Format time (seconds to MM:SS)
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Determine if the video is playable or if we should show an error/thumbnail
  const isVideoReady = !isLoading && !error;
  const showThumbnail = !isVideoReady || (!isPlaying && thumbnail);

  return (
    <div className="relative rounded-lg overflow-hidden bg-black">
      {/* Video or Thumbnail */}
      <div className="relative aspect-video">
        {showThumbnail && thumbnail && (
          <div 
            className="absolute inset-0 bg-center bg-cover" 
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
          className={`w-full h-full object-contain ${showThumbnail ? 'invisible' : 'visible'}`}
          poster={thumbnail}
          onClick={togglePlay}
          preload="metadata"
          playsInline
        />
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
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
            onClick={enterFullscreen}
          >
            <Maximize size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
