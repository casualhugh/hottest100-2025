import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Game from "@/pages/Game";
import Manage from "@/pages/Manage";
import Name from "@/pages/Name";
import Settings from "@/pages/Settings";
import Votes from "@/pages/Votes";
import Welcome from "@/pages/Welcome";
import LoginQuestion from "@/pages/LoginQuestion";
import NewGame from "@/pages/NewGame";
import SignIn from "@/pages/SignIn";
import MainLayout from "@/layouts/MainLayout";
import { PocketProvider } from "@/contexts/PocketContext";

const AppRoutes: React.FC = () => (
  <PocketProvider>
    <MainLayout>
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/votes/:id" element={<Votes />} />
          <Route path="/manage/:id" element={<Manage />} />
          <Route path="/name/:id" element={<Name />} />
          <Route path="/settings/:id" element={<Settings />} />
          <Route path="/game/:id" element={<Game />} />
          <Route path="/question/:id" element={<LoginQuestion />} />
          <Route path="/new/" element={<NewGame />} />
          <Route path="/login/" element={<SignIn />} />
        </Routes>
      </Router>
    </MainLayout>
  </PocketProvider>
);

export default AppRoutes;
