import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { getStandupResponses, getTeamsOnly} from '../../services/api';
import '../styles/Reports.css';

interface Team {
  _id: string;
  name: string;
  members: string[];
  is_archived: boolean;
}

interface Member {
  _id: string;
  name: string;
}

interface Standup {
  _id: string;
  team: {
    _id: string;
    name: string;
  };
  member: Member;
  date: string;
  update: Array<{
    question: { _id: string; text: string },
    answer: string
  }>;
}

const Reports: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [standups, setStandups] = useState<Standup[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [missedMembers, setMissedMembers] = useState<Member[]>([]);
  const [pendingMembers, setPendingMembers] = useState<Member[]>([]);
  const [completedMembers, setCompletedMembers] = useState<Member[]>([]);

  // Fetch teams
  const fetchTeams = async () => {
    try {
      const response = await getTeamsOnly();
      const data: Team[] = await response.data;
      setTeams(data.filter(team => !team.is_archived));

      console.log()
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  // Fetch standups
  const fetchStandups = async () => {
    try {
      const response = await getStandupResponses();
      const data = await response.data;
      setStandups(data.standups);
    } catch (error) {
      console.error('Error fetching standups:', error);
    }
  };

  // Calculate member statuses
  useEffect(() => {
    if (selectedTeam && teams.length && standups.length) {
      const currentTeam = teams.find(team => team._id === selectedTeam);
      if (currentTeam) {
        const teamStandups = standups.filter(standup => standup.team._id === selectedTeam);
        
        // const teamMemberIds = new Set(currentTeam.members);
        // const standupsUserIds = new Set(teamStandups.map(s => s.member._id));

        const missed = teamStandups
          .filter(standup => standup.update.length === 0)
          .map(standup => standup.member);

        const pending = teamStandups
          .filter(standup => standup.update.length === 0)
          .map(standup => standup.member);

        const completed = teamStandups
          .filter(standup => standup.update.length > 0)
          .map(standup => standup.member);

        setMissedMembers(missed);
        setPendingMembers(pending);
        setCompletedMembers(completed);
      }
    }
  }, [selectedTeam, teams, standups]);

  // Initial data fetch
  useEffect(() => {
    fetchTeams();
    fetchStandups();
  }, []);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const teamName = teams.find(t => t._id === selectedTeam)?.name || 'Team';
    
    doc.text(`${teamName} Standup Report`, 10, 10);
    
    doc.text('Missed Standups:', 10, 20);
    missedMembers.forEach((member, index) => {
      doc.text(`- ${member.name}`, 10, 30 + index * 10);
    });

    doc.text('Pending Standups:', 10, 50 + missedMembers.length * 10);
    pendingMembers.forEach((member, index) => {
      doc.text(`- ${member.name}`, 10, 60 + missedMembers.length * 10 + index * 10);
    });

    doc.text('Completed Standups:', 10, 80 + (missedMembers.length + pendingMembers.length) * 10);
    completedMembers.forEach((member, index) => {
      doc.text(`- ${member.name}`, 10, 90 + (missedMembers.length + pendingMembers.length) * 10 + index * 10);
    });

    doc.save('standup_report.pdf');
  };

  return (
    <div className='report-container'>
      <h1>Standup Report</h1>
      <div className='team-selection'>
      <label htmlFor="team">Choose a team:</label>
      <select 
        id="team" 
        value={selectedTeam} 
        onChange={(e) => setSelectedTeam(e.target.value)}
      >
        <option value="">Select a team</option>
        {teams.map((team) => (
        <option key={team._id} value={team._id}>
          {team.name}
        </option>
        ))}
      </select>
      </div>
      <div className='members-area'>
      <h2>Missed Standup Members</h2>
      <ul>
        {missedMembers.map((member) => (
         <li key={member._id}>{member.name}</li>
        ))}
      </ul>
      </div>
      <div className='members-area'>
      <h2>Pending Standup Members</h2>
      <ul>
        {pendingMembers.map((member) => (
        <li key={member._id}>{member.name}</li>
        ))}
      </ul>
      </div>
      <div className='members-area'>
      <h2>Completed Standup Members</h2>
      <ul>
        {completedMembers.map((member) => (
        <li key={member._id}>{member.name}</li>
        ))}
      </ul>
      </div>
      <div className='export-button'>
      <button onClick={handleExportPDF}>Export Standup Report</button>
      </div>
    </div>
  );
};

export default Reports;