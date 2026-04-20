'use client';

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react';

declare global {
  interface Window {
    YT?: {
      Player: new (
        element: HTMLElement,
        config: {
          videoId: string;
          playerVars?: Record<string, string | number>;
          events?: {
            onReady?: (event: { target: YouTubePlayer }) => void;
            onStateChange?: (event: { data: number; target: YouTubePlayer }) => void;
          };
        }
      ) => YouTubePlayer;
      PlayerState: {
        ENDED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

type YouTubePlayer = {
  destroy: () => void;
  pauseVideo: () => void;
  playVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
  setVolume: (volume: number) => void;
  unMute: () => void;
};

export type AmbiencePlayerHandle = {
  pause: () => void;
  play: () => void;
};

let youtubeApiPromise: Promise<NonNullable<Window['YT']>> | null = null;

function loadYoutubeIframeApi() {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('YouTube iframe API is only available in the browser.'));
  }

  if (window.YT?.Player) {
    return Promise.resolve(window.YT);
  }

  if (!youtubeApiPromise) {
    youtubeApiPromise = new Promise((resolve) => {
      const previousReady = window.onYouTubeIframeAPIReady;

      window.onYouTubeIframeAPIReady = () => {
        previousReady?.();
        if (window.YT) {
          resolve(window.YT);
        }
      };

      const existingScript = document.querySelector('script[data-youtube-iframe-api="true"]');

      if (!existingScript) {
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        script.async = true;
        script.dataset.youtubeIframeApi = 'true';
        document.head.appendChild(script);
      }
    });
  }

  return youtubeApiPromise;
}

export const AmbiencePlayer = forwardRef<AmbiencePlayerHandle, {
  videoId: string;
  startSeconds: number;
  volume: number;
  isPlaying: boolean;
}>(function AmbiencePlayerImpl({
  videoId,
  startSeconds,
  volume,
  isPlaying
}, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const readyRef = useRef(false);

  const playPlayer = useCallback(() => {
    if (!readyRef.current || !playerRef.current) {
      return;
    }

    playerRef.current.unMute();
    playerRef.current.setVolume(volume);
    playerRef.current.playVideo();
  }, [volume]);

  const pausePlayer = useCallback(() => {
    if (!readyRef.current || !playerRef.current) {
      return;
    }

    playerRef.current.pauseVideo();
  }, []);

  useImperativeHandle(ref, () => ({
    play: playPlayer,
    pause: pausePlayer
  }), [pausePlayer, playPlayer]);

  useEffect(() => {
    let disposed = false;
    readyRef.current = false;

    loadYoutubeIframeApi().then((YT) => {
      if (disposed || !containerRef.current) {
        return;
      }

      playerRef.current?.destroy();
      playerRef.current = new YT.Player(containerRef.current, {
        videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          loop: 1,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          playlist: videoId,
          start: startSeconds,
          origin: window.location.origin
        },
        events: {
          onReady: ({ target }) => {
            readyRef.current = true;
            target.unMute();
            target.setVolume(volume);
            if (isPlaying) {
              target.playVideo();
            }
          },
          onStateChange: ({ data, target }) => {
            if (data === YT.PlayerState.ENDED) {
              target.seekTo(startSeconds, true);
              if (isPlaying) {
                target.playVideo();
              }
            }
          }
        }
      });
    });

    return () => {
      disposed = true;
      readyRef.current = false;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [isPlaying, startSeconds, videoId, volume]);

  useEffect(() => {
    playerRef.current?.setVolume(volume);
  }, [volume]);

  useEffect(() => {
    if (isPlaying) {
      playPlayer();
      return;
    }

    pausePlayer();
  }, [isPlaying, pausePlayer, playPlayer]);

  return (
    <div className="pointer-events-none fixed bottom-2 right-2 h-4 w-4 overflow-hidden opacity-[0.01]" aria-hidden="true">
      <div ref={containerRef} />
    </div>
  );
});