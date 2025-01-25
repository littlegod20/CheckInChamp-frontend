import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../Navbar';
import '../styles/StandupDetailsPage.css';

// Mock data
const mockStandups = [
  {
    id: 1,
    team: 'Team Alpha',
    date: '2025-01-20',
    member: 'Alice',
    status: 'completed',
    answers: [
      { question: 'What did you do yesterday?', answer: 'Worked on the API integration.' },
      { question: 'What are you doing today?', answer: 'Fixing bugs in the frontend.' },
      { question: 'Any blockers?', answer: 'None at the moment.' },
    ],
  },
  // Add more mock standups here    
  {
    id: 2,
    team: 'Team Beta',
    date: '2025-01-20',
    member: 'Bob',
    status: 'pending',
    answers: [
      { question: 'What did you do yesterday?', answer: 'Worked on the UI design.' },
      { question: 'What are you doing today?', answer: 'Writing unit tests.' },
      { question: 'Any blockers?', answer: 'None at the moment.' },
    ],
  },
    {
        id: 3,
        team: 'Team Alpha',
        date: '2025-01-21',
        member: 'Charlie',
        status: 'completed',
        answers: [
        { question: 'What did you do yesterday?', answer: 'Worked on the API integration.' },
        { question: 'What are you doing today?', answer: 'Fixing bugs in the frontend.' },
        { question: 'Any blockers?', answer: 'None at the moment.' },
        ],
    },      
  
];

const StandupDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get dynamic id from URL
  const standup = mockStandups.find((item) => item.id === parseInt(id || '0')); // Find the standup by ID

  if (!standup) {
    return (
      <div>
        <Navbar />
        <h1>Standup Not Found</h1>
      </div>
    );
  }

  return (
    <div className='standup-details-page'>
      <Navbar />
      <h1>Standup Details</h1>
      <p><strong>Team:</strong> {standup.team}</p>
      <p><strong>Date:</strong> {standup.date}</p>
      <p><strong>Member:</strong> {standup.member}</p>
      <p><strong>Status:</strong> {standup.status}</p>
      {standup.answers ? (
        <ul>
          {standup.answers.map((answer, index) => (
            <li key={index}>
              <strong>{answer.question}:</strong> {answer.answer}
            </li>
          ))}
        </ul>
      ) : (
        <p>No answers available for this standup.</p>
      )}
    </div>
  );
};

export default StandupDetailsPage;
