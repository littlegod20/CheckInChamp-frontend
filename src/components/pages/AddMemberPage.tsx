import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../Navbar';
import TeamNav from '../TeamNav';
import "../styles/AddMemberPage.css";
import "../styles/Global.css";
import { getMembers, addMember, setTeamReminders } from '../../services/api';

interface Member {
  id: string;
  name: string;
}

const AddMemberPage: React.FC = () => {
  const [memberName, setMemberName] = useState('');
  const [members, setMembers] = useState<Member[]>([]);
  const [availableMembers, setAvailableMembers] = useState<Member[]>([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [reminderTime, setReminderTime] = useState('');
  const [reminderText, setReminderText] = useState('');
  const navigate = useNavigate();

  // Get teamId from URL
  const { teamId } = useParams();

  useEffect(() => {
    // Fetch available members from the backend
    const fetchMembers = async () => {
      try {
        const response = await getMembers();
        if (response.status !== 200) {
          throw new Error('Failed to fetch members');
        }
        const data: Member[] = await response.data.users;
        setAvailableMembers(data);
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };
    fetchMembers();
  }, []); // Empty dependency array ensures this runs only once

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Members to be added:', members);

    if (teamId) {
      try {
        // Add members to the team
        const added = await addMember(teamId, members);
        if (added.status !== 200 && added.status !== 201) {
          throw new Error('Failed to add members to the team');
        }

        // Send the reminder
        const reminderData = {
          channel: teamId, // Assuming teamId maps to the Slack channel ID
          text: reminderText,
          scheduleTime: new Date().toISOString().split("T")[0] + "T" + reminderTime + ":00", // Combine date and time
        };
        const reminderResponse = await setTeamReminders(reminderData);

        if (reminderResponse.status !== 200 && reminderResponse.status !== 201) {
          throw new Error('Failed to set team reminders');
        }

        alert('Members added successfully and reminders set');
        navigate(`/`);
      } catch (error) {
        console.error('Error adding members or setting reminders:', error);
        alert('An error occurred. Please try again.');
      }
    } else {
      console.error('Team ID is undefined');
    }
  };

  const handleAddToSelectedMembers = (member: Member) => {
    if (!members.find((m) => m.id === member.id)) {
      setMembers([...members, member]);
      setAvailableMembers(availableMembers.filter((m) => m.id !== member.id)); // Remove from dropdown
    }
  };

  const handleRemoveMember = (memberId: string) => {
    const removedMember = members.find((m) => m.id === memberId);
    if (removedMember) {
      setMembers(members.filter((m) => m.id !== memberId));
      setAvailableMembers([...availableMembers, removedMember]); // Add back to dropdown
    }
  };

  return (
    <div className="page-container add-member-page">
      <Navbar />
      <TeamNav />
      <h1>Add Participants to Team</h1>
      <form className="add-member-form" onSubmit={handleAddMember}>
        <label>
          Member Name:
          <input
            type="text"
            value={memberName}
            onFocus={() => setDropdownVisible(true)} // Show dropdown on focus
            onChange={(e) => setMemberName(e.target.value)}
          />
        </label>
        {dropdownVisible && (
          <ul className="dropdown">
            {availableMembers
              .filter((member) =>
                member.name.toLowerCase().includes(memberName.toLowerCase())
              )
              .map((member) => (
                <li
                  key={member.id}
                  onClick={() => {
                    handleAddToSelectedMembers(member);
                    setDropdownVisible(false); // Hide dropdown on selection
                    setMemberName(''); // Clear input
                  }}
                >
                  {member.name}
                </li>
              ))}
          </ul>
        )}
        <h3>Selected Members</h3>
        <ul className="selected-members">
          {members.map((member) => (
            <li key={member.id} className="member-item">
              {member.name}
              <button
                type="button"
                className="close-button"
                onClick={() => handleRemoveMember(member.id)}
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
        <div>
          <label>Reminder Time:</label>
          <input
            type="time"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Reminder Text:</label>
          <input
            type="text"
            value={reminderText}
            onChange={(e) => setReminderText(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Participants</button>
      </form>
    </div>
  );
};

export default AddMemberPage;
