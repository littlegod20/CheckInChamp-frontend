import React from "react";
import { Link } from "react-router-dom";
import "../Navbar.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUsers,  faChartBar } from '@fortawesome/free-solid-svg-icons';

const Navbar: React.FC = () => (
  <nav className="navbar">
  <Link to="/" className="nav-item" title="Home">
    <span className="icon"><FontAwesomeIcon icon={faHome} /></span>
  </Link>
  <Link to="/teams" className="nav-item" title="Teams">
    <span className="icon"><FontAwesomeIcon icon={faUsers} /></span>
  </Link>
  
  
  <Link to="/teams/:teamId/members/:memberId/standup" className="nav-item" title="Standup Collection">
    <span className="icon"><FontAwesomeIcon icon={faChartBar} /></span>
  </Link>
</nav>

);

export default Navbar;
