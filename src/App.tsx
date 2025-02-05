import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import ManageTeam from "./pages/TeamPage";
import MainLayout from "./layout";
import StandupsPage from "./pages/StandupPage";
import MoodTrackingPage from "./pages/MoodTracking";
import MasterAnalyticsPage from "./pages/MasterAnalytics";
import StandupDetailsPage from "./pages/StandupDetailsPage";
import KudosDashboard from "./pages/KudosDashboard";
import KudosHistory from "./pages/KudosHistory";
import Leaderboard from "./pages/Leaderboard";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/teams/" element={<ManageTeam />} />
          <Route path="/standups/" element={<StandupsPage />} />
          <Route path="/standups/:id" element={<StandupDetailsPage />} />
          <Route path="/mood tracking" element={<MoodTrackingPage />} />
          <Route path="/master analytics" element={<MasterAnalyticsPage />} />
          <Route path="/kudos-history" element={<KudosHistory />} />
          <Route path="/kudos" element={<KudosDashboard />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
