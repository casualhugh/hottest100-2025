import React from "react";
import "./main.css";
import { useLiveHlsAudio } from "@/hooks/useLiveHlsAudio";
import { LiveAudioControls } from "@/components/LiveAudioControls";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    audioRef,
    isPlaying,
    toggle,
  } = useLiveHlsAudio();
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden animated-background text-white font-roboto">
      <main className="flex-grow flex items-center justify-center">
        {children}
        <LiveAudioControls
              isPlaying={isPlaying}
              onToggle={toggle}
            />
      </main>
      <audio ref={audioRef} />
    </div>
  );
};

export default MainLayout;
