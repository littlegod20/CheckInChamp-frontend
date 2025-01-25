import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../Navbar';

const RemoveTeam: React.FC = () => {
    const [teams, setTeams] = useState<string[]>([]);
    const [selectedTeam, setSelectedTeam] = useState<string>('');

    useEffect(() => {
        // Fetch all teams when the component mounts
        axios.get('/api/teams')
            .then(response => {
                setTeams(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the teams!', error);
            });
    }, []);

    const handleDelete = () => {
        if (selectedTeam) {
            axios.delete(`/api/teams/${selectedTeam}`)
                .then(response => {
                    // Remove the deleted team from the state
                    setTeams(teams.filter(team => team !== selectedTeam));
                    setSelectedTeam('');
                    console.log(response)
                })
                .catch(error => {
                    console.error('There was an error deleting the team!', error);
                });
        }
    };

    return (
        <div>
            <Navbar />
            <h1>Remove Team</h1>
            <select value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)}>
                <option value="" disabled>Select a team to delete</option>
                {teams.map(team => (
                    <option key={team} value={team}>{team}</option>
                ))}
            </select>
            <button onClick={handleDelete} disabled={!selectedTeam}>Delete Team</button>
        </div>
    );
};

export default RemoveTeam;