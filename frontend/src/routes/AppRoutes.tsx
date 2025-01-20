import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
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
import { RequireAuth } from "@/components/RequireAuth";
import { RequireInGame } from "@/components/RequireInGame";

const AppRoutes: React.FC = () => (
  <Router>
    <PocketProvider>
      <MainLayout>
        <Routes>
          <Route path="*" element={<Navigate to={{ pathname: "/" }} />} />
          <Route path="/" element={<Welcome />} />
          <Route path="/login/" element={<SignIn />} />
          <Route path="/name/:id" element={<Name />} />
          <Route path="/question/:id" element={<LoginQuestion />} />
          <Route element={<RequireAuth />}>
            <Route path="/new/" element={<NewGame />} />

            <Route element={<RequireInGame />}>
              <Route path="/votes/:id" element={<Votes />} />
              <Route path="/settings/:id" element={<Settings />} />
              <Route path="/game/:id" element={<Game />} />
              <Route path="/manage/:id" element={<Manage />} />
            </Route>
          </Route>
        </Routes>
      </MainLayout>
    </PocketProvider>
  </Router>
);

export default AppRoutes;
