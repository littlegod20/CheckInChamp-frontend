import { FormTypes } from "@/types/CardWithFormTypes";
import { Pencil, PencilIcon, Plus, Trash2, UserPlus2Icon } from "lucide-react";
import { useState } from "react";

// interface Team {
//   id: string;
//   name: string;
//   slackChannelId: string;
//   standupQuestions: string[];
//   members: { id: string; name: string }[];
// }

// interface Member {
//   id: string;
//   name: string;
// }

// interface ApiResponse {
//   users: { id: string; name: string }[];
// }

// function transformResponseToMembers(response: ApiResponse): Member[] {
//   return response.users.map((user) => ({
//     id: user.id,
//     name: user.name,
//   }));
// }

// function transformApiResponse(apiResponse: { team: { _id: string; name: string; slackChannelId: string; members: string[] }; questions: { text: string }[] }[]): Team[] {
//   return apiResponse.map((item) => ({
//     id: item.team._id,
//     name: item.team.name,
//     slackChannelId: item.team.slackChannelId,
//     standupQuestions: item.questions.map((q) => q.text),
//     members: item.team.members.map((memberId: string, index: number) => ({
//       id: (index + 1).toString(),
//       name: memberId,
//     })),
//   }));
// }

// const TeamsPage: React.FC = () => {
//   const [teams, setTeams] = useState<Team[]>([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchTeamsAndMembers = async () => {
//       try {
//         // Fetch teams
//         const teamResponse = await getTeams();
//         let transformedTeams: Team[] = [];
//         if (Array.isArray(teamResponse.data)) {
//           transformedTeams = transformApiResponse(teamResponse.data);
//         } else {
//           console.error("Unexpected API response format for teams", teamResponse.data);
//         }

//         // Fetch members
//         const memberResponse = await getMembers();
//         let members: Member[] = [];
//         if (Array.isArray(memberResponse.data?.users)) {
//           members = transformResponseToMembers(memberResponse.data);
//           //console.log(members);
//         } else {
//           console.error("Unexpected API response format for members", memberResponse.data);
//         }

//         // Combine teams and members
//         const updatedTeams = transformedTeams.map((team) => ({
//           ...team,
//           members: team.members.map((member) => ({
//             ...member,
//             name: members.find((user) => user.id === member.name)?.name || member.name,
//             id: member.name,
//           })),
//         }));

//         console.log(updatedTeams);
//         setTeams(updatedTeams);
//       } catch (error) {
//         console.error('Error fetching teams or members:', error);
//         setTeams([]); // Fallback to an empty array on error
//       }
//     };

//     fetchTeamsAndMembers();
//   }, []);

//   const handleDeleteTeam = async (teamId: string) => {
//     try {
//       console.log(teamId)
//       const deleted = await deleteTeam(teamId);
//       if (deleted.status === 200) {
//         setTeams(teams.filter((team) => team.slackChannelId !== teamId));

//         console.log('Team deleted successfully');
//       } else {
//         console.error('Error deleting team:', deleted);
//       }
//     } catch (error) {
//       console.error('Error deleting team:', error);
//     }
//   };

//   const handleRemoveMember = async (teamId: string, memberId: string) => {
//     try {

//       console.log(memberId)
//       const deleted = await removeMember(teamId, memberId);

//       if (deleted.status === 200) {
//         setTeams(teams.map((team) =>
//           team.slackChannelId === teamId
//            ? {...team, members: team.members.filter((member) => member.id!== memberId) }
//             : team
//         ));

//         alert('Member removed successfully');
//       } else {

//         alert(deleted)
//         console.error('Error removing member:', deleted);
//       }

//     } catch (error) {
//       console.error('Error removing member:', error);
//     }
//   };

//   return (
//     <div>
//       <div className="team-management-header-container">
//         <Navbar />
//         <div className="team-management-header">
//           <h1>Team Management</h1>
//           <p>
//             Welcome to the Team Setup Page! Here, you can create and manage your teams effortlessly.
//             <br />
//             Manage team members by adding their details, including email and time zone.
//             <br />
//             Set custom schedules, configure standup questions, and define reminder times for each team.
//             <br />
//             Get started by creating your first team or selecting an existing one to edit!
//           </p>
//           <button onClick={() => navigate('/add-team')} className="create-team-btn">
//             + Create Team
//           </button>
//         </div>
//       </div>
//       <div className="teams-container">
//   {teams.map((team) => (
//     <div key={team.id} className="team-card">
//       <div className="team-card-top">
//         <h2>{team.name}</h2>
//         <div className="dropdown-container">
//           <button className="dropdown-btn">...</button>
//           <div className="dropdown-content">
//             <button onClick={() => handleDeleteTeam(team.slackChannelId)}>Delete Team</button>
//           </div>
//         </div>
//       </div>
//       <h4>Standup Questions:</h4>
//       <ul>
//         {team.standupQuestions.map((question, index) => (
//           <li key={index}>{question}</li>
//         ))}
//       </ul>
//       <h4>Members:</h4>
//       <ul className="members-list">
//         {team.members.map((member) => (
//           <li key={member.id} className="member-item">
//             <span>{member.name}</span>
//             <div className="dropdown-container">
//               <button
//                 onClick={() => handleRemoveMember(team.slackChannelId, member.id)}
//                 className="remove-member-btn"
//               >
//                 ...
//               </button>
//               <div className="dropdown-content">
//                 <button>Remove</button>
//               </div>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   ))}
// </div>

//       </div>

//   );
// };

// export default TeamsPage;

// interface Team {
//   id: string;
//   name: string;
//   members: string[];
//   schedule: string[];
//   questions: string[];
//   reminders: string[];
//   timezone: string;
// }

const TeamsPage = () => {
  const [selectedTeam, setSelectedTeam] = useState<FormTypes | null>(null);
  const [activeTab, setActiveTab] = useState<
    "members" | "schedule" | "questions" | "reminders"
  >("members");
  const [newMember, setNewMember] = useState("");

  // Dummy data
  const [teams, setTeams] = useState<FormTypes[]>([
    {
      id: "1",
      name: "Engineering Team",
      members: ["Alice", "Bob", "Charlie"],
      standUpConfig: {
        questions: [
          {
            id: 0,
            text: "What did you work on yesterday?",
            type: "text",
            options: [],
          },
          {
            id: 2,
            text: "What are you working on today?",
            type: "text",
            options: [],
          },
        ],

        standUpDays: ["Monday 09:00", "Wednesday 09:00"],
        standUpTimes: ["09:15", "12:00"],
        reminderTimes: ["09:15", "12:00"],
      },
      timezone: "UTC",
    },
    {
      id: "2",
      name: "Static Team",
      members: ["Alice", "Bob", "Charlie"],
      standUpConfig: {
        questions: [
          {
            id: 0,
            text: "What did you work on yesterday?",
            type: "text",
            options: [],
          },
          {
            id: 2,
            text: "What are you working on today?",
            type: "text",
            options: [],
          },
        ],

        standUpDays: ["Monday 09:00", "Wednesday 09:00"],
        standUpTimes: ["09:15", "12:00"],
        reminderTimes: ["09:15", "12:00"],
      },
      timezone: "UTC",
    },
    // Add more dummy teams...
  ]);

  const handleAddTeam = () => {
    const newTeam: FormTypes = {
      id: Date.now().toString(),
      name: `New Team ${teams.length + 1}`,
      members: [],
      standUpConfig: {
        questions: [
          {
            id: 0,
            text: "",
            type: "",
            options: [],
          },
        ],
        standUpDays: [],
        standUpTimes: [],
        reminderTimes: [],
      },
      timezone: "",
    };
    setTeams([...teams, newTeam]);
  };

  const handleAddMember = () => {
    if (selectedTeam && newMember.trim()) {
      const updatedTeams = teams.map((team) =>
        team.id === selectedTeam.id
          ? { ...team, members: [...team.members, newMember.trim()] }
          : team
      );
      setTeams(updatedTeams);
      setNewMember("");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-black-secondary">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teams Management</h1>
          <p className="text-gray-600 mt-2">
            Manage your teams and their configurations
          </p>
        </div>
        <button
          onClick={handleAddTeam}
          className="bg-green-primary text-white px-4 py-2 rounded-lg hover:bg-green-primary flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Team
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team List */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">All Teams</h2>
          <div className="space-y-3">
            {teams.map((team) => (
              <div
                key={team.id}
                onClick={() => setSelectedTeam(team)}
                className={`p-4 rounded-lg cursor-pointer transition-colors ${
                  selectedTeam?.id === team.id
                    ? "bg-blue-50 border-green-primary"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{team.name}</h3>
                  <div className="flex space-x-2">
                    <button className="text-gray-400 hover:text-green-primary">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button className="text-gray-400 hover:text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <p>{team.members.length} members</p>
                  <p>{team.standUpConfig.standUpDays.length} scheduled days</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Details */}
        {selectedTeam && (
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">{selectedTeam.name}</h2>
              <div className="flex space-x-2">
                <button className="text-gray-400 hover:text-green-secondary">
                  <Pencil className="h-5 w-5" />
                </button>
                <button className="text-gray-400 hover:text-red-500">
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-4 border-b mb-6">
              {(["members", "schedule", "questions", "reminders"] as const).map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-2 px-4 ${
                      activeTab === tab
                        ? "border-b-2 border-green-primary text-green-secondary"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                )
              )}
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === "members" && (
                <div>
                  <div className="flex mb-4">
                    <input
                      type="text"
                      value={newMember}
                      onChange={(e) => setNewMember(e.target.value)}
                      placeholder="Add new member"
                      className="flex-1 p-2 border rounded-l-lg"
                    />
                    <button
                      onClick={handleAddMember}
                      className="bg-green-primary text-white px-4 py-2 rounded-r-lg hover:bg-green-secondary"
                    >
                      <UserPlus2Icon className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {selectedTeam.members.map((member) => (
                      <div
                        key={member}
                        className="flex justify-between items-center p-2 hover:bg-gray-50 rounded"
                      >
                        <span>{member}</span>
                        <button className="text-red-500 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "schedule" && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <select className="p-2 border rounded-lg">
                      {[
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                        "Sunday",
                      ].map((day) => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                    </select>
                    <input type="time" className="p-2 border rounded-lg" />
                    <button className="bg-green-primary text-white px-4 py-2 rounded-lg hover:bg-green-secondary">
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {selectedTeam.standUpConfig.standUpDays.map(
                      (schedule, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-2 hover:bg-gray-50 rounded"
                        >
                          <span>{schedule}</span>
                          <button className="text-red-500 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {activeTab === "questions" && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <input
                      type="text"
                      placeholder="Add new question"
                      className="flex-1 p-2 border rounded-lg"
                    />
                    <button className="bg-green-primary text-white px-4 py-2 rounded-lg hover:bg-green-secondary">
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {selectedTeam.standUpConfig.questions.map(
                      (question, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-2 hover:bg-gray-50 rounded"
                        >
                          <span>{question.text}</span>
                          <div className="flex space-x-2">
                            <button className="text-green-primary hover:text-green-secondary">
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button className="text-red-500 hover:text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {activeTab === "reminders" && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <input type="time" className="p-2 border rounded-lg" />
                    <button className="bg-green-primary text-white px-4 py-2 rounded-lg hover:bg-green-secondary">
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {selectedTeam.standUpConfig.reminderTimes.map(
                      (reminder, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-2 hover:bg-gray-50 rounded"
                        >
                          <span>{reminder}</span>
                          <button className="text-red-500 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamsPage;
