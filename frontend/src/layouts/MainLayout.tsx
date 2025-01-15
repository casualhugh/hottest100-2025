import React from "react";
import { usePocket } from "@/contexts/PocketContext";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = usePocket();
  if (user) console.log(user.username, user.name, user.email);
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-mainbg  text-white font-roboto">
      <main className="flex-grow flex items-center justify-center">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
