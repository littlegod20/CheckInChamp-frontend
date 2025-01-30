import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { createTeam } from '../../services/api';
import Navbar from '../Navbar';
import "../styles/CreateTeam.css";

const TeamPage: React.FC = () => {
  const [teamName, setTeamName] = useState('');
  const [teamDescription, setDescription] = useState('');
 

  const navigate = useNavigate(); // Initialize navigate

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create the team
      const response = await createTeam({ name: teamName, description: teamDescription });
      console.log('Team created successfully:', response.data);
      
      // Redirect to the Configure Standup Questions page
      navigate(`/configure-standup-questions/${response.data.slackChannel.id}`);
    } catch (error) {
      console.error('Error creating team:', error);
    }
  };

  return (
    <div className="team-page">
      <Navbar />
      <h1>Create Team</h1>
      <form className="team-form" onSubmit={handleCreateTeam}>
        <label>
          Team Name:
          <input 
            type="text" 
            value={teamName} 
            onChange={(e) => setTeamName(e.target.value)} 
            required 
          />
        </label>

        <label>
          Team Description:
          <input 
            type="text" 
            value={teamDescription} 
            onChange={(e) => setDescription(e.target.value)} 
            required 
          />
        </label>

       
        <button type="submit">Create Team</button>
      </form>
    </div>
  );
};

export default TeamPage;
