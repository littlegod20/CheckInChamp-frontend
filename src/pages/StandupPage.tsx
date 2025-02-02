// import React, { useState, useEffect } from 'react';
// import Navbar from '../components/Navbar';
// import '../styles/StandupPage.css';
// import { getStandupResponses } from '../services/api';

// interface Standup {
//   id: string;
//   team: string;
//   date: string;
//   member: string;
//   update: { question: string; answer: string; _id: string }[];
//   status: 'completed' | 'pending';
// }

// const Modal: React.FC<{ isOpen: boolean; standup: Standup | null; onClose: () => void }> = ({ isOpen, standup, onClose }) => {
//   if (!isOpen || !standup) return null;

//   return (
//     <div className="modal-overlay" onClick={onClose}>
//       <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//         <h2>Standup Answers for {standup.member}</h2>
//         <p>Team: {standup.team}</p>
//         <p>Date: {standup.date}</p>
//         <p>Status: {standup.status}</p>
//         <div>
//           <h3>Answers:</h3>
//           <ul>
//             {standup.update.map((updateItem) => (
//               <li key={updateItem._id}>
//                 <strong>Q: {typeof updateItem.question === 'string' ? updateItem.question : 'Invalid question'}</strong>
//                 <p>A: {typeof updateItem.answer === 'string' ? updateItem.answer : 'Invalid answer'}</p>
//               </li>
//             ))}
//           </ul>
//         </div>
//         <button onClick={onClose}>Close</button>
//       </div>
//     </div>
//   );
// };

// const StandupPage: React.FC = () => {
//   const [standups, setStandups] = useState<Standup[]>([]);
//   const [filteredStandups, setFilteredStandups] = useState<Standup[]>([]);
//   const [searchOption, setSearchOption] = useState<'team' | 'member' | 'date' | ''>('');
//   const [searchValue, setSearchValue] = useState('');
//   const [sort, setSort] = useState<'completed' | 'pending' | ''>('');
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedStandup, setSelectedStandup] = useState<Standup | null>(null);

//   const handleItemClick = (standup: Standup) => {
//     setSelectedStandup(standup);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedStandup(null);
//   };

//   useEffect(() => {
//     const fetchStandups = async () => {
//       try {
//         const response = await getStandupResponses();
//         const data = response.data;

//         const formattedStandups: Standup[] = data.standups.map((item: {
//           _id: string;
//           team: { name: string };
//           date: string;
//           member: { name: string };
//           update: { question: string; answer: string; _id: string }[];
//         }) => ({
//           id: item._id,
//           team: item.team?.name || 'No Team',
//           date: new Date(item.date).toISOString().split('T')[0],
//           member: item.member.name,
//           status: item.update.length > 0 ? 'completed' : 'pending',
//           update: item.update.map((updateItem) => ({
//             question: typeof updateItem.question === 'string' ? updateItem.question : 'Invalid question',
//             answer: typeof updateItem.answer === 'string' ? updateItem.answer : 'Invalid answer',
//             _id: updateItem._id || ''
//           }))
//         }));

//         setStandups(formattedStandups);
//         setFilteredStandups(formattedStandups);
//       } catch (error) {
//         console.error('Error fetching standups:', error);
//       }
//     };

//     fetchStandups();
//   }, []);

//   useEffect(() => {
//     let filtered = standups;

//     if (searchOption && searchValue) {
//       filtered = filtered.filter((standup) => {
//         if (searchOption === 'team') return standup.team.includes(searchValue);
//         if (searchOption === 'member') return standup.member.includes(searchValue);
//         if (searchOption === 'date') return standup.date === searchValue;
//         return true;
//       });
//     }

//     if (sort) {
//       filtered = filtered.sort((a) => (a.status === sort ? -1 : 1));
//     }

//     setFilteredStandups(filtered);
//   }, [searchOption, searchValue, sort, standups]);

//   return (
//     <div className="standup-page">
//       <Navbar />
//       <h1 className="page-title">Team Standups</h1>
//       <p>
//         The Team Standup Dashboard serves as a hub for managing and monitoring all team standups.
//         Users can search by team, member, or date and sort by status.
//       </p>
//       <form className="standup-filter-form">
//         <div className="form-group">
//           <label htmlFor="searchOption" className="form-label">
//             Search By:
//           </label>
//           <select
//             id="searchOption"
//             value={searchOption}
//             onChange={(e) => setSearchOption(e.target.value as 'team' | 'member' | 'date' | '')}
//             className="form-select"
//           >
//             <option value="">Select an option</option>
//             <option value="team">Team</option>
//             <option value="member">Member</option>
//             <option value="date">Date</option>
//           </select>
//         </div>
//         {searchOption && (
//           <div className="form-group">
//             <label htmlFor="searchValue" className="form-label">
//               {searchOption === 'date' ? 'Select Date' : `Enter ${searchOption.charAt(0).toUpperCase() + searchOption.slice(1)}`}
//             </label>
//             <input
//               id="searchValue"
//               type={searchOption === 'date' ? 'date' : 'text'}
//               value={searchValue}
//               onChange={(e) => setSearchValue(e.target.value)}
//               className="form-input"
//             />
//           </div>
//         )}
//         <div className="form-group">
//           <label htmlFor="sort" className="form-label">
//             Sort by Status:
//           </label>
//           <select
//             id="sort"
//             value={sort}
//             onChange={(e) => setSort(e.target.value as 'completed' | 'pending' | '')}
//             className="form-select"
//           >
//             <option value="">None</option>
//             <option value="completed">Completed</option>
//             <option value="pending">Pending</option>
//           </select>
//         </div>
//       </form>
//       <ul className="standup-list">
//         {filteredStandups.map((standup) => (
//           <li key={standup.id} className="standup-item" onClick={() => handleItemClick(standup)}>
//             <span>{standup.team}</span> - <span>{standup.date}</span> -{' '}
//             <span>{standup.member}</span> -{' '}
//             <span className={`status ${standup.status}`}>{standup.status}</span>
//           </li>
//         ))}
//       </ul>

//       <Modal isOpen={isModalOpen} standup={selectedStandup} onClose={closeModal} />
//     </div>
//   );
// };

// export default StandupPage;

import { Calendar1, CheckCircle, DownloadIcon, XCircle } from "lucide-react";
import { useState } from "react";

interface Standup {
  id: string;
  team: string;
  date: string;
  time: string;
  participants: number;
  totalMembers: number;
  status: "completed" | "pending";
}

const StandupsPage = () => {
  const [selectedTeam, setSelectedTeam] = useState<string>("All Teams");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All Statuses");

  // Dummy data
  const standups: Standup[] = [
    {
      id: "1",
      team: "Engineering Team",
      date: "2023-10-01",
      time: "09:00 AM",
      participants: 8,
      totalMembers: 10,
      status: "completed",
    },
    {
      id: "2",
      team: "Design Team",
      date: "2023-10-01",
      time: "10:00 AM",
      participants: 5,
      totalMembers: 7,
      status: "pending",
    },
    {
      id: "3",
      team: "Marketing Team",
      date: "2023-10-02",
      time: "11:00 AM",
      participants: 6,
      totalMembers: 8,
      status: "completed",
    },
  ];

  // Filtered standups
  const filteredStandups = standups.filter((standup) => {
    const teamMatch =
      selectedTeam === "All Teams" || standup.team === selectedTeam;
    const dateMatch = !selectedDate || standup.date === selectedDate;
    const statusMatch =
      selectedStatus === "All Statuses" ||
      standup.status === selectedStatus.toLowerCase();
    return teamMatch && dateMatch && statusMatch;
  });

  // Teams for filter dropdown
  const teams = [
    "All Teams",
    "Engineering Team",
    "Design Team",
    "Marketing Team",
  ];

  // Statuses for filter dropdown
  const statuses = ["All Statuses", "Completed", "Pending"];

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-black-secondary">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Standups</h1>
        <p className="text-gray-600 mt-2">
          View and manage all standups across teams
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Team Filter */}
        <div className="flex-1">
          <label
            htmlFor="team"
            className="block text-sm font-medium text-gray-700"
          >
            Team
          </label>
          <select
            id="team"
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm"
          >
            {teams.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
        </div>

        {/* Date Filter */}
        <div className="flex-1">
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700"
          >
            Date
          </label>
          <div className="relative mt-1">
            <input
              type="date"
              id="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded-lg shadow-sm"
            />
            <Calendar1 className="h-5 w-5 absolute right-3 top-2.5 text-gray-400" />
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex-1">
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700"
          >
            Status
          </label>
          <select
            id="status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Standups Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Team
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Participants
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStandups.map((standup) => (
              <tr
                key={standup.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {standup.team}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {standup.date} at {standup.time}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {standup.participants}/{standup.totalMembers}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      standup.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {standup.status === "completed" ? (
                      <CheckCircle className="h-4 w-4 inline-block mr-1" />
                    ) : (
                      <XCircle className="h-4 w-4 inline-block mr-1" />
                    )}
                    {standup.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-blue-500 hover:text-blue-700">
                    <DownloadIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredStandups.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No standups found matching your filters.
          </p>
        </div>
      )}
    </div>
  );
};

export default StandupsPage;
