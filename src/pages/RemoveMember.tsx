import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../Navbar';

interface Team {
    id: string;
    name: string;
}

interface Member {
    id: string;
    name: string;
}

const RemoveMember: React.FC = () => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [selectedTeam, setSelectedTeam] = useState('');
    const [members, setMembers] = useState<Member[]>([]);
    const [selectedMember, setSelectedMember] = useState('');

    useEffect(() => {
        // Fetch all teams
        axios.get('/api/teams')
            .then(response => setTeams(response.data))
            .catch(error => console.error('Error fetching teams:', error));
    }, []);

    useEffect(() => {
        if (selectedTeam) {
            // Fetch members of the selected team
            axios.get(`/api/teams/${selectedTeam}/members`)
                .then(response => setMembers(response.data))
                .catch(error => console.error('Error fetching members:', error));
        }
    }, [selectedTeam]);

    const handleRemoveMember = () => {
        if (selectedMember) {
            // Remove the selected member
            axios.delete(`/api/members/${selectedMember}`)
                .then(() => {
                    // Update members list after removal
                    setMembers(members.filter(member => member.id !== selectedMember));
                    setSelectedMember('');
                })
                .catch(error => console.error('Error removing member:', error));
        }
    };

    return (
        <div>
            <Navbar />
            <h1>Remove Member</h1>
            <div>
                <label>Select Team:</label>
                <select value={selectedTeam} onChange={e => setSelectedTeam(e.target.value)}>
                    <option value="">--Select Team--</option>
                    {teams.map(team => (
                        <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                </select>
            </div>
            {selectedTeam && (
                <div>
                    <label>Select Member:</label>
                    <select value={selectedMember} onChange={e => setSelectedMember(e.target.value)}>
                        <option value="">--Select Member--</option>
                        {members.map(member => (
                            <option key={member.id} value={member.id}>{member.name}</option>
                        ))}
                    </select>
                </div>
            )}
            {selectedMember && (
                <button onClick={handleRemoveMember}>Remove Member</button>
            )}
        </div>
    );
};

export default RemoveMember;