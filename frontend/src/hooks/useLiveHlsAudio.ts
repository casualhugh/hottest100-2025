import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

const STREAM_URL =
  "https://mediaserviceslive.akamaized.net/hls/live/2109456/triplejnsw/v0-221.m3u8";

export function useLiveHlsAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);

  // Init HLS
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.canPlayType("application/vnd.apple.mpegurl")) {
      audio.src = STREAM_URL;
    } else if (Hls.isSupported()) {
      const hls = new Hls({
        lowLatencyMode: true,
        backBufferLength: 90,
        liveSyncDuration: 0.5,  
      });

      hls.loadSource(STREAM_URL);
      hls.attachMedia(audio);
      hlsRef.current = hls;
    }

    return () => {
      hlsRef.current?.destroy();
      hlsRef.current = null;
    };
  }, []);

  const play = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    await audio.play();
    setIsPlaying(true);
  };

  const pause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    setIsPlaying(false);
  };

  const toggle = () => {
    isPlaying ? pause() : play();
  };

  return {
    audioRef,
    isPlaying,
    play,
    pause,
    toggle,
  };
}
