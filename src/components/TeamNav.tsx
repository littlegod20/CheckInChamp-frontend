import React, { useState } from "react";
import { Link } from "react-router-dom";
import '../TeamNav.css';

const TeamNavbar: React.FC = () => {
  // const [standupName, setStandupName] = useState("");

  return (
    <div className="team-management-team-nav">
      <div className="team-nav-header">
      <Link to='/configure-standup-questions' className="team-nav-item">
        <span className="icon">1</span> Questions
      </Link>
      <Link to='/add-team-member' className="team-nav-item">
        <span className="icon">2</span> Add members
      </Link>
     
    </div>
    </div>
  );
};

export default TeamNavbar;
