/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import {
  FastForward,
  Maximize,
  Pause,
  Play,
  SkipBack,
  Volume2,
  VolumeX,
} from "lucide-react";

import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

type VideoPlayerProps = {
  videoId: string;
};

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

/**
 *
 * @param root0
 * @param root0.videoId
 */
export default function VideoPlayer({ videoId }: VideoPlayerProps) {
  const playerRef = useRef<any>(null); // Reference to YouTube Player instance
  const containerRef = useRef<HTMLDivElement>(null); // Reference to container for fullscreen
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [isReady, setIsReady] = useState(false); // Track when player is ready
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const timeUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load YouTube IFrame Player API script
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        initializePlayer();
      };
    } else if (!playerRef.current) {
      initializePlayer();
    }

    return () => {
      if (timeUpdateIntervalRef.current) {
        clearInterval(timeUpdateIntervalRef.current);
      }
    };
  }, [videoId]);

  const initializePlayer = () => {
    playerRef.current = new window.YT.Player("youtube-player", {
      height: "100%",
      width: "100%",
      videoId: videoId,
      playerVars: {
        controls: 0, // Hide default controls
        modestbranding: 1, // Minimize YouTube branding
        rel: 0, // Don't show related videos
        fs: 0, // Disable fullscreen button (we'll use our own)
        autoplay: 1, // Enable autoplay
      },
      events: {
        onReady: () => {
          setIsReady(true);
          setDuration(playerRef.current.getDuration());
          setVolume(playerRef.current.getVolume() / 100); // YouTube uses 0-100, we use 0-1

          // Start playing when the player is ready
          playerRef.current.playVideo();

          // Start time update interval
          timeUpdateIntervalRef.current = setInterval(() => {
            setCurrentTime(playerRef.current.getCurrentTime());
          }, 100);
        },
        onStateChange: (event: any) => {
          if (event.data === window.YT.PlayerState.PLAYING) {
            setIsPlaying(true);
          } else if (event.data === window.YT.PlayerState.PAUSED) {
            setIsPlaying(false);
          }
        },
      },
    });
  };

  const togglePlay = () => {
    if (!playerRef.current || !isReady) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (playerRef.current && isReady) {
      playerRef.current.setVolume(newVolume * 100); // YouTube uses 0-100 scale
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (!playerRef.current || !isReady) return;
    if (isMuted) {
      playerRef.current.unMute();
      playerRef.current.setVolume(volume * 100 || 100);
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  };

  const handleSeek = (value: number[]) => {
    const newTime = value[0];
    setCurrentTime(newTime);
    if (playerRef.current && isReady) {
      playerRef.current.seekTo(newTime, true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleMouseMove = () => {
    setIsControlsVisible(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setIsControlsVisible(false);
      }
    }, 3000);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen();
    }
  };

  return (
    <div
      ref={containerRef}
      className="video-container relative aspect-video overflow-hidden rounded-lg bg-black"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setIsControlsVisible(false)}
    >
      {/* YouTube iframe player */}
      <div id="youtube-player" className="size-full" />

      {/* Play/Pause overlay */}
      {!isPlaying && isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <button
            onClick={togglePlay}
            className="flex size-16 items-center justify-center rounded-full bg-white/20"
          >
            <Play className="size-8 fill-white text-white" />
          </button>
        </div>
      )}

      {/* Controls */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 transition-opacity",
          isControlsVisible ? "opacity-100" : "opacity-0",
        )}
      >
        {/* Progress bar */}
        <Slider
          value={[currentTime]}
          max={duration}
          step={0.01}
          onValueChange={handleSeek}
          className="w-full [&>span:first-child]:h-1 [&>span:first-child]:bg-white/30 [&>span:first-child_span]:bg-red-500 [&_[role=slider]]:size-3 [&_[role=slider]]:border-0 [&_[role=slider]]:bg-red-500"
        />

        <div className="mt-2 flex items-center gap-3">
          <button onClick={togglePlay} className="text-white">
            {isPlaying ? (
              <Pause className="size-5" />
            ) : (
              <Play className="size-5" />
            )}
          </button>

          <button className="text-white">
            <SkipBack className="size-5" />
          </button>

          <button className="text-white">
            <FastForward className="size-5" />
          </button>

          <div className="flex items-center gap-2 text-sm text-white">
            <span>{formatTime(currentTime)}</span>
            <span>/</span>
            <span>{formatTime(duration)}</span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button onClick={toggleMute} className="text-white">
              {isMuted ? (
                <VolumeX className="size-5" />
              ) : (
                <Volume2 className="size-5" />
              )}
            </button>

            <Slider
              value={[isMuted ? 0 : volume]}
              max={1}
              step={0.01}
              onValueChange={handleVolumeChange}
              className="w-20 [&>span:first-child]:h-1 [&>span:first-child]:bg-white/30 [&>span:first-child_span]:bg-white [&_[role=slider]]:size-3 [&_[role=slider]]:border-0 [&_[role=slider]]:bg-white"
            />

            <button onClick={toggleFullscreen} className="text-white">
              <Maximize className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
