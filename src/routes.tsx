import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CreateTeamPage from "./pages/CreateTeam";
import ManageTeam from "./pages/TeamPage";
import AddMemberPage from "./pages/AddMemberPage";
import HomePage from "./pages/HomePage";
import RemoveTeam from "./pages/RemoveTeam";
import RemoveMember from "./pages/RemoveMember";
import ConfigureStandup from "./pages/ConfigureStandupQuestions";
import StandupPage from "./pages/StandupPage";
import NotFoundPage from "./pages/NotFoundPage";
import Reports from "./pages/Reports";
import StandupDetailsPage from "./pages/StandupDetailsPage";
import AnswerStandup from "./pages/AnswerStandup";

const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/teams/", element: <ManageTeam /> },
  { path: "/add-team", element: <CreateTeamPage /> },
  { path: "/remove-team", element: <RemoveTeam /> },
  { path: "/add-team-member/:teamId", element: <AddMemberPage /> },
  { path: "/remove-team-member", element: <RemoveMember /> },
  {
    path: "/configure-standup-questions/:teamId",
    element: <ConfigureStandup />,
  },
  { path: "/standup-answer/:teamId", element: <AnswerStandup /> },
  { path: "/create-team", element: <CreateTeamPage /> },
  { path: "/teams/:teamId/members", element: <AddMemberPage /> },
  {
    path: "/teams/:teamId/members/:memberId/standup",
    element: <StandupPage />,
  },
  { path: "/standup-collection/:id", element: <StandupDetailsPage /> }, // Add this route
  { path: "/reports", element: <Reports /> },
  { path: "*", element: <NotFoundPage /> },
]);


const Routes: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default Routes;
