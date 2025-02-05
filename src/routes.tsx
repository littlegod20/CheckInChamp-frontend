import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ManageTeam from "./pages/TeamPage";
import HomePage from "./pages/HomePage";
import StandupPage from "./pages/StandupPage";
import Reports from "./pages/Reports";
import StandupDetailsPage from "./pages/StandupDetailsPage";
import KudosHistory from "./pages/KudosHistory";
import KudosDashboard from "./pages/KudosDashboard";
import Leaderboard from "./pages/Leaderboard";


const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/teams', element: <ManageTeam /> },
  { path: '/teams/:teamId/members/:memberId/standup', element: <StandupPage /> },
  { path: '/standup-collection/:id', element: <StandupDetailsPage /> },
  { path: '/reports', element: <Reports /> },
  { path: '/kudos-history', element: <KudosHistory /> },
  { path: '/kudos-dashboard', element: <KudosDashboard /> },
  { path: '/leaderboard', element: <Leaderboard /> },
])



const Routes: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default Routes;
