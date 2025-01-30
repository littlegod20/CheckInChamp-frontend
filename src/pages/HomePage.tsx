import React from "react";
import { Link } from "react-router-dom";
import "../styles/HomePage.css";
import Navbar from "../Navbar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faClipboard, faChartBar } from '@fortawesome/free-solid-svg-icons';

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <Navbar />
      <h1>Welcome to the FlowSync Bot App</h1>
      <p>Streamline your team's daily standups and reporting with ease.</p>
      <div className="home-links">
        <Link to="/teams" className="card">
          <div className="card-icon">
            <FontAwesomeIcon icon={faUsers} />
          </div>
          <div className="card-title">Create/Manage Teams</div>
        </Link>
        
        <Link to="/teams/:teamId/members/:memberId/standup" className="card">
          <div className="card-icon">
            <FontAwesomeIcon icon={faClipboard} />
          </div>
          <div className="card-title">View Standups</div>
        </Link>
        <Link to="/reports" className="card">
          <div className="card-icon">
            <FontAwesomeIcon icon={faChartBar} />
          </div>
          <div className="card-title">Generate Reports</div>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
