
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import CreateTeamPage from './components/pages/CreateTeam';
import ManageTeam from './components/pages/TeamPage';
import AddMemberPage from './components/pages/AddMemberPage';
import HomePage from './components/pages/HomePage';
import RemoveTeam from './components/pages/RemoveTeam';
import RemoveMember from './components/pages/RemoveMember';
import ConfigureStandup from './components/pages/ConfigureStandupQuestions';
import StandupPage from './components/pages/StandupPage';
import NotFoundPage from './components/pages/NotFoundPage';
import Reports from './components/pages/Reports';
import StandupDetailsPage from './components/pages/StandupDetailsPage';
import AnswerStandup from './components/pages/AnswerStandup';
import KudosHistory from './components/pages/KudosHistory';
import KudosDashboard from './components/pages/KudosDashboard';
import Leaderboard from './components/pages/Leaderboard';

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/teams', element: <ManageTeam /> },
  { path: '/create-team', element: <CreateTeamPage /> },
  { path: '/remove-team', element: <RemoveTeam /> },
  { path: '/teams/:teamId/members', element: <AddMemberPage /> },
  { path: '/teams/:teamId/members/:memberId/remove', element: <RemoveMember /> },
  { path: '/configure-standup-questions/:teamId', element: <ConfigureStandup /> },
  { path: '/standup-answer/:teamId', element: <AnswerStandup /> },
  { path: '/teams/:teamId/members/:memberId/standup', element: <StandupPage /> },
  { path: '/standup-collection/:id', element: <StandupDetailsPage /> },
  { path: '/reports', element: <Reports /> },
  { path: '/kudos-history', element: <KudosHistory /> },
  { path: '/kudos-dashboard', element: <KudosDashboard /> },
  { path: '/leaderboard', element: <Leaderboard /> },
  { path: '*', element: <NotFoundPage /> },

]);


const Routes: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default Routes;
