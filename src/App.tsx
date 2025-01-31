import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import ManageTeam from "./pages/TeamPage";
import MainLayout from "./layout";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/teams/" element={<ManageTeam />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
