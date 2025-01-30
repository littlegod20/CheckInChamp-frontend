// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import Navbar from '../Navbar';
// interface Team {
//     id: string;
//     name: string;
// }

// const SetUniqueTeamSchedules: React.FC = () => {
//     const [teams, setTeams] = useState([]);
//     const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
//     const [reminderType, setReminderType] = useState<string>('custom');
//     const [reminderDate, setReminderDate] = useState<string>('');

//     useEffect(() => {
//         // Fetch all teams from the API
//         axios.get('/api/teams')
//             .then(response => {
//                 setTeams(response.data);
//             })
//             .catch(error => {
//                 console.error('Error fetching teams:', error);
//             });
//     }, []);

//     const handleTeamSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
//         setSelectedTeam(event.target.value);
//     };

//     const handleReminderTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//         setReminderType(event.target.value);
//     };

//     const handleReminderDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         setReminderDate(event.target.value);
//     };

//     const handleSubmit = () => {
//         if (selectedTeam && reminderDate) {
//             // Submit the reminder setup
//             axios.post('/api/set-reminder', {
//                 teamId: selectedTeam,
//                 reminderType,
//                 reminderDate
//             })
//             .then(response => {
//                 alert('Reminder set successfully!');
//                 console.log(response);
//             })
//             .catch(error => {
//                 console.error('Error setting reminder:', error);
//             });
//         } else {
//             alert('Please select a team and set a reminder date.');
//         }
//     };

//     return (
//         <div>
//             <Navbar />
//             <h1>Set Unique Team Schedules</h1>
//             <div>
//                 <label htmlFor="team-select">Select Team:</label>
//                 <select id="team-select" onChange={handleTeamSelect}>
//                     <option value="">--Select a team--</option>
//                     {teams.map((team: Team) => (
//                         <option key={team.id} value={team.id}>{team.name}</option>
//                     ))}
//                 </select>
//             </div>
//             {selectedTeam && (
//                 <div>
//                     <label htmlFor="reminder-type">Reminder Type:</label>
//                     <select id="reminder-type" value={reminderType} onChange={handleReminderTypeChange}>
//                         <option value="custom">Custom Date</option>
//                         <option value="time">Just the Time</option>
//                         <option value="daily">Daily</option>
//                         <option value="weekly">Weekly</option>
//                         <option value="monthly">Monthly</option>
//                     </select>
//                     <div>
//                         <label htmlFor="reminder-date">Reminder Date:</label>
//                         <input
//                             type="datetime-local"
//                             id="reminder-date"
//                             value={reminderDate}
//                             onChange={handleReminderDateChange}
//                         />
//                     </div>
//                     <button onClick={handleSubmit}>Set Reminder</button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default SetUniqueTeamSchedules;


// // const renderReminderInput = () => {
// //     switch (reminderType) {
// //         case 'custom':
// //             return (
// //                 <div>
// //                     <label htmlFor="reminder-date">Reminder Date and Time:</label>
// //                     <input
// //                         type="datetime-local"
// //                         id="reminder-date"
// //                         value={reminderDate}
// //                         onChange={handleReminderDateChange}
// //                     />
// //                 </div>
// //             );
// //         case 'daily':
// //         case 'weekly':
// //         case 'monthly':
// //             return (
// //                 <div>
// //                     <label htmlFor="reminder-time">Reminder Time:</label>
// //                     <input
// //                         type="time"
// //                         id="reminder-time"
// //                         value={reminderDate}
// //                         onChange={handleReminderDateChange}
// //                     />
// //                 </div>
// //             );
// //         default:
// //             return null;
// //     }
// // };

// // return (
// //     <div>
// //         <h1>Set Unique Team Schedules</h1>
// //         <div>
// //             <label htmlFor="team-select">Select Team:</label>
// //             <select id="team-select" onChange={handleTeamSelect}>
// //                 <option value="">--Select a team--</option>
// //                 {teams.map((team: Team) => (
// //                     <option key={team.id} value={team.id}>{team.name}</option>
// //                 ))}
// //             </select>
// //         </div>
// //         {selectedTeam && (
// //             <div>
// //                 <label htmlFor="reminder-type">Reminder Type:</label>
// //                 <select id="reminder-type" value={reminderType} onChange={handleReminderTypeChange}>
// //                     <option value="custom">Custom Date</option>
// //                     <option value="time">Just the Time</option>
// //                     <option value="daily">Daily</option>
// //                     <option value="weekly">Weekly</option>
// //                     <option value="monthly">Monthly</option>
// //                 </select>
// //                 {renderReminderInput()}
// //                 <button onClick={handleSubmit}>Set Reminder</button>
// //             </div>
// //         )}
// //     </div>
// // );