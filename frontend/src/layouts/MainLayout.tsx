import React from "react";
import "./main.css";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden animated-background text-white font-roboto">
      <main className="flex-grow flex items-center justify-center">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
