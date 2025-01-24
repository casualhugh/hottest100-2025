import React from "react";
import CastProvider from "react-chromecast";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <CastProvider>
      <div className="flex flex-col h-screen w-screen overflow-hidden bg-mainbg  text-white font-roboto">
        <main className="flex-grow flex items-center justify-center">
          {children}
        </main>
      </div>
    </CastProvider>
  );
};

export default MainLayout;
