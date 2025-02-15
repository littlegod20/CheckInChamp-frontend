import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ManageTeam from "./pages/TeamPage";
import MainLayout from "./layout";
import StandupsPage from "./pages/StandupPage";
import MoodTrackingPage from "./pages/MoodTracking";
import MasterAnalyticsPage from "./pages/MasterAnalytics";
import StandupDetailsPage from "./pages/StandupDetailsPage";
import KudosDashboard from "./pages/KudosDashboard";
import Polls from "./pages/Polls";

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
          <Route path="/kudos" element={<KudosDashboard />} />
          <Route path="/polls" element={<Polls />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
