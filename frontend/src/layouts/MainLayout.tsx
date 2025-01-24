import React from "react";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-mainbg  text-white font-roboto">
      <main className="flex-grow flex items-center justify-center">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
