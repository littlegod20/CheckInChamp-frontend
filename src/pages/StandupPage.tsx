import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar';
import '../styles/StandupPage.css';
import { getStandupResponses } from '../../services/api';

interface Standup {
  id: string;
  team: string;
  date: string;
  member: string;
  update: { question: string; answer: string; _id: string }[];
  status: 'completed' | 'pending';
}

const Modal: React.FC<{ isOpen: boolean; standup: Standup | null; onClose: () => void }> = ({ isOpen, standup, onClose }) => {
  if (!isOpen || !standup) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Standup Answers for {standup.member}</h2>
        <p>Team: {standup.team}</p>
        <p>Date: {standup.date}</p>
        <p>Status: {standup.status}</p>
        <div>
          <h3>Answers:</h3>
          <ul>
            {standup.update.map((updateItem) => (
              <li key={updateItem._id}>
                <strong>Q: {typeof updateItem.question === 'string' ? updateItem.question : 'Invalid question'}</strong>
                <p>A: {typeof updateItem.answer === 'string' ? updateItem.answer : 'Invalid answer'}</p>
              </li>
            ))}
          </ul>
        </div>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

const StandupPage: React.FC = () => {
  const [standups, setStandups] = useState<Standup[]>([]);
  const [filteredStandups, setFilteredStandups] = useState<Standup[]>([]);
  const [searchOption, setSearchOption] = useState<'team' | 'member' | 'date' | ''>('');
  const [searchValue, setSearchValue] = useState('');
  const [sort, setSort] = useState<'completed' | 'pending' | ''>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStandup, setSelectedStandup] = useState<Standup | null>(null);

  const handleItemClick = (standup: Standup) => {
    setSelectedStandup(standup);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStandup(null);
  };

  useEffect(() => {
    const fetchStandups = async () => {
      try {
        const response = await getStandupResponses();
        const data = response.data;
        
        const formattedStandups: Standup[] = data.standups.map((item: {
          _id: string;
          team: { name: string };
          date: string;
          member: { name: string };
          update: { question: string; answer: string; _id: string }[];
        }) => ({
          id: item._id,
          team: item.team?.name || 'No Team',
          date: new Date(item.date).toISOString().split('T')[0],
          member: item.member.name,
          status: item.update.length > 0 ? 'completed' : 'pending',
          update: item.update.map((updateItem) => ({
            question: typeof updateItem.question === 'string' ? updateItem.question : 'Invalid question',
            answer: typeof updateItem.answer === 'string' ? updateItem.answer : 'Invalid answer',
            _id: updateItem._id || ''
          }))
        }));

        setStandups(formattedStandups);
        setFilteredStandups(formattedStandups);
      } catch (error) {
        console.error('Error fetching standups:', error);
      }
    };

    fetchStandups();
  }, []);

  useEffect(() => {
    let filtered = standups;

    if (searchOption && searchValue) {
      filtered = filtered.filter((standup) => {
        if (searchOption === 'team') return standup.team.includes(searchValue);
        if (searchOption === 'member') return standup.member.includes(searchValue);
        if (searchOption === 'date') return standup.date === searchValue;
        return true;
      });
    }

    if (sort) {
      filtered = filtered.sort((a) => (a.status === sort ? -1 : 1));
    }

    setFilteredStandups(filtered);
  }, [searchOption, searchValue, sort, standups]);

  return (
    <div className="standup-page">
      <Navbar />
      <h1 className="page-title">Team Standups</h1>
      <p>
        The Team Standup Dashboard serves as a hub for managing and monitoring all team standups. 
        Users can search by team, member, or date and sort by status.
      </p>
      <form className="standup-filter-form">
        <div className="form-group">
          <label htmlFor="searchOption" className="form-label">
            Search By:
          </label>
          <select
            id="searchOption"
            value={searchOption}
            onChange={(e) => setSearchOption(e.target.value as 'team' | 'member' | 'date' | '')}
            className="form-select"
          >
            <option value="">Select an option</option>
            <option value="team">Team</option>
            <option value="member">Member</option>
            <option value="date">Date</option>
          </select>
        </div>
        {searchOption && (
          <div className="form-group">
            <label htmlFor="searchValue" className="form-label">
              {searchOption === 'date' ? 'Select Date' : `Enter ${searchOption.charAt(0).toUpperCase() + searchOption.slice(1)}`}
            </label>
            <input
              id="searchValue"
              type={searchOption === 'date' ? 'date' : 'text'}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="form-input"
            />
          </div>
        )}
        <div className="form-group">
          <label htmlFor="sort" className="form-label">
            Sort by Status:
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as 'completed' | 'pending' | '')}
            className="form-select"
          >
            <option value="">None</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </form>
      <ul className="standup-list">
        {filteredStandups.map((standup) => (
          <li key={standup.id} className="standup-item" onClick={() => handleItemClick(standup)}>
            <span>{standup.team}</span> - <span>{standup.date}</span> -{' '}
            <span>{standup.member}</span> -{' '}
            <span className={`status ${standup.status}`}>{standup.status}</span>
          </li>
        ))}
      </ul>

      <Modal isOpen={isModalOpen} standup={selectedStandup} onClose={closeModal} />
    </div>
  );
};

export default StandupPage;
