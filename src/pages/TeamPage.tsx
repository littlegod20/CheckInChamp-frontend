import CustomSelect from "@/components/CustomSelect";
import MultitSelect from "@/components/MultitSelect";
import { api } from "@/services/api";
import { FormTypes, Questions } from "@/types/CardWithFormTypes";
import { convertTo12Hour } from "@/utils/helpers";
import axios from "axios";
import { Check, Loader2, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { MultiValue } from "react-select";

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

  const [searchQuery, setSearchQuery] = useState("");

  const [teams, setTeams] = useState<FormTypes[] | null>(null);

  const [availableMembers, setAvailableMembers] = useState<
    { id: string; member: string }[]
  >([{ id: "", member: "" }]);

  const [loading, setLoading] = useState<
    "loading" | "failed" | "success" | "idle"
  >("idle");

  const [newSchedule, setNewSchedule] = useState({ day: "", time: "" });
  const [newReminder, setNewReminder] = useState("");
  const [newQuestion, setNewQuestion] = useState<Questions>({
    text: "",
    type: "",
    options: [],
  });

  // Handle member selection from Multiselect
  const handleMemberSelect = (
    selectedOptions: MultiValue<{ value: string; label: string }>
  ) => {
    if (!selectedTeam) return;

    const updatedTeam = {
      ...selectedTeam,
      members: selectedOptions.map((option) => option.value),
    };

    setSelectedTeam(updatedTeam);
    updateTeamInList(updatedTeam);
  };

  // Remove a member from the team
  const handleRemoveMember = (memberId: string) => {
    if (!selectedTeam) return;

    const updatedTeam = {
      ...selectedTeam,
      members: selectedTeam.members.filter((id) => id !== memberId),
    };

    setSelectedTeam(updatedTeam);
    updateTeamInList(updatedTeam);
  };

  // Add new schedule day/time
  const handleAddSchedule = () => {
    if (!selectedTeam || (!newSchedule.day && !newSchedule.time)) return;

    let updatedTeam: FormTypes;

    if (newSchedule.day) {
      updatedTeam = {
        ...selectedTeam,
        standUpConfig: {
          ...selectedTeam.standUpConfig,
          standUpDays: [
            ...selectedTeam.standUpConfig.standUpDays,
            newSchedule.day,
          ],
        },
      };
      setSelectedTeam(updatedTeam);
      updateTeamInList(updatedTeam);
      setNewSchedule({ day: "", time: "" });
      // console.log("day:", updatedTeam);
    } else if (newSchedule.time) {
      // get time in 12hr format
      const time12hr = convertTo12Hour(newSchedule.time);
      updatedTeam = {
        ...selectedTeam,
        standUpConfig: {
          ...selectedTeam.standUpConfig,
          standUpTimes: [...selectedTeam.standUpConfig.standUpTimes, time12hr],
        },
      };
      setSelectedTeam(updatedTeam);
      updateTeamInList(updatedTeam);
      setNewSchedule({ day: "", time: "" });
      // console.log("time", updatedTeam);
    }
  };

  // Remove a schedule entry
  const handleRemoveSchedule = (
    scheduleIndex: number,
    type: "day" | "time"
  ) => {
    if (!selectedTeam) return;

    const updatedTeam = {
      ...selectedTeam,
      standUpConfig: {
        ...selectedTeam.standUpConfig,
        // Update either days or times based on type parameter
        ...(type === "day"
          ? {
              standUpDays: selectedTeam.standUpConfig.standUpDays.filter(
                (_, index) => index !== scheduleIndex
              ),
            }
          : {
              standUpTimes: selectedTeam.standUpConfig.standUpTimes.filter(
                (_, index) => index !== scheduleIndex
              ),
            }),
      },
    };

    setSelectedTeam(updatedTeam);
    updateTeamInList(updatedTeam);
  };

  // Add new reminder time
  const handleAddReminder = () => {
    if (!selectedTeam || !newReminder) return;

    const to12hr = convertTo12Hour(newReminder);

    const updatedTeam = {
      ...selectedTeam,
      standUpConfig: {
        ...selectedTeam.standUpConfig,
        reminderTimes: [...selectedTeam.standUpConfig.reminderTimes, to12hr],
      },
    };

    setSelectedTeam(updatedTeam);
    updateTeamInList(updatedTeam);
    setNewReminder("");
  };

  // Remove a reminder
  const handleRemoveReminder = (reminderIndex: number) => {
    if (!selectedTeam) return;

    const updatedTeam = {
      ...selectedTeam,
      standUpConfig: {
        ...selectedTeam.standUpConfig,
        reminderTimes: selectedTeam.standUpConfig.reminderTimes.filter(
          (_, index) => index !== reminderIndex
        ),
      },
    };

    setSelectedTeam(updatedTeam);
    updateTeamInList(updatedTeam);
  };

  // Add new question
  const handleAddQuestion = () => {
    if (!selectedTeam || !newQuestion.text || !newQuestion.type) return;

    // Find the highest existing question ID
    const highestId = selectedTeam.standUpConfig.questions.reduce(
      (maxId, question) => Math.max(maxId, Number(question.id) || 0),
      0
    );

    const updatedTeam = {
      ...selectedTeam,
      standUpConfig: {
        ...selectedTeam.standUpConfig,
        questions: [
          ...selectedTeam.standUpConfig.questions,
          {
            id: `${highestId + 1}`,
            text: newQuestion.text,
            type: newQuestion.type,
            options:
              newQuestion.type === "multiple_choice"
                ? newQuestion.options.map((item) => item.trim())
                : [],
          },
        ],
      },
    };

    setSelectedTeam(updatedTeam);
    updateTeamInList(updatedTeam);

    console.log("updated:", updatedTeam);
    setNewQuestion({ text: "", type: "", options: [] });
  };
  // Remove a question
  const handleRemoveQuestion = (questionId: number) => {
    if (!selectedTeam) return;

    const updatedTeam = {
      ...selectedTeam,
      standUpConfig: {
        ...selectedTeam.standUpConfig,
        questions: selectedTeam.standUpConfig.questions.filter(
          (q) => Number(q.id) !== Number(questionId)
        ),
      },
    };

    setSelectedTeam(updatedTeam);
    updateTeamInList(updatedTeam);
  };

  // Update team in main list
  const updateTeamInList = (updatedTeam: FormTypes) => {
    setTeams(
      (prevTeams) =>
        prevTeams?.map((team) =>
          team._id === updatedTeam._id ? updatedTeam : team
        ) || null
    );
  };

  const saveTeam = async (team: FormTypes) => {
    setLoading("loading");
    try {
      const response = await api.put("/teams/update", team);
      console.log("updatedTeam:", response.data);
      if (response.status !== 200) {
        throw new Error("Could not update team");
      }
      setLoading("success");
    } catch (error) {
      console.error("Error saving team", error);
      setLoading("failed");
      setTimeout(() => {
        setLoading("idle");
      }, 2000);
    }
  };

  const deleteTeam = async (team: FormTypes) => {
    try {
      console.log("slackChannelId:", team.slackChannelId);
      const response = await api.delete(`/teams/${team.slackChannelId}`);

      if (response.status !== 200) {
        throw new Error("Could not delete team");
      }
      setLoading("success");

      // temporal timeout
      setTimeout(() => {
        setLoading("idle");
      }, 2000); // 2 seconds delay

      console.log("deleted Team:", response.data);
    } catch (error) {
      console.error("Error deleting team", error);
      setTimeout(() => {
        setLoading("idle");
      }, 2000);
    }
  };

  // fetching all teams and members
  useEffect(() => {
    const fetchTeams = async () => {
      const response = await axios.get("http://localhost:5000/api/teams");
      console.log("fetched Teams:", response.data);
      setTeams(response.data);
    };
    const fetchAllMembers = async () => {
      const response = await axios.get("http://localhost:5000/api/members");
      console.log("membersFetch:", response.data.users);
      const allMembers = response.data.users;
      setAvailableMembers(
        allMembers.map((item: FormTypes) => ({
          id: item.id,
          member: item.name,
        }))
      );
    };
    fetchTeams();
    fetchAllMembers();
  }, []);

  useEffect(() => {
    console.log("loading:", loading);
  }, [loading]);

  // Format available members for react-select
  const memberOptions =
    availableMembers &&
    availableMembers.map((member) => ({
      value: member.id,
      label: member.member,
    }));

  return (
    <div className="p-6 bg-gray-50  text-black-secondary">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teams Management</h1>
          <p className="text-gray-600 mt-2">
            Manage your teams and their configurations
          </p>
        </div>
        <button
          // onClick={handleAddTeam}
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
          {/* Search input for teams */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search teams by name..."
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-primary"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* List of teams */}
          <div className="space-y-3 h-screen overflow-y-scroll">
            {Array.isArray(teams) &&
              teams
                .filter((team) =>
                  team.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((team) => (
                  <div
                    key={team._id}
                    onClick={() => setSelectedTeam(team)}
                    className={`p-4 rounded-lg cursor-pointer transition-colors ${
                      selectedTeam?._id === team._id
                        ? "bg-green-100 border-green-primary"
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
                      <p>
                        {team.standUpConfig.standUpDays.length} scheduled days
                      </p>
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
                <button className="text-gray-400 ">
                  {loading === "loading" ? (
                    <Loader2 className="text-yellow-400" />
                  ) : loading === "success" ? (
                    <Check className="text-green-600" />
                  ) : loading === "failed" ? (
                    <X className="text-red-600" />
                  ) : (
                    <Save
                      className="h-5 w-5 hover:text-green-secondary"
                      onClick={() => saveTeam(selectedTeam)}
                    />
                  )}
                </button>
                <button className="text-gray-400 hover:text-red-500">
                  <Trash2
                    className="h-5 w-5"
                    onClick={() => deleteTeam(selectedTeam)}
                  />
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
              {/*  Members Tab */}
              {activeTab === "members" && (
                <div>
                  <div className="mb-4">
                    <MultitSelect
                      options={memberOptions}
                      handleSelect={(selected) => handleMemberSelect(selected)}
                      field="members"
                      selectedValues={selectedTeam.members}
                    />
                  </div>
                  <div className="space-y-2">
                    {selectedTeam.members.map((memberId) => {
                      const member = availableMembers.find(
                        (m) => m.id === memberId
                      );
                      return (
                        <div
                          key={memberId}
                          className="flex justify-between items-center p-2 hover:bg-gray-50 rounded"
                        >
                          <span>{member?.member || "Unknown Member"}</span>
                          <button
                            onClick={() => handleRemoveMember(memberId)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {/* Schedule Tab */}
              {activeTab === "schedule" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <select
                        value={newSchedule.day}
                        onChange={(e) =>
                          setNewSchedule({
                            ...newSchedule,
                            day: e.target.value,
                          })
                        }
                        className="p-2 border rounded-lg"
                      >
                        <option value="">Select Day</option>
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
                      <button
                        onClick={handleAddSchedule}
                        className="bg-green-primary text-white px-4 py-2 rounded-lg hover:bg-green-secondary"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 w-1/2">
                      <input
                        type="time"
                        value={newSchedule.time}
                        onChange={(e) =>
                          setNewSchedule({
                            ...newSchedule,
                            time: e.target.value,
                          })
                        }
                        className="p-2 border rounded-lg"
                      />
                      <button
                        onClick={handleAddSchedule}
                        className="bg-green-primary text-white px-4 py-2 rounded-lg hover:bg-green-secondary"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between gap-4 items-start">
                    <div className="w-1/2">
                      <p className="text-sm font-bold">Days</p>
                      {selectedTeam.standUpConfig.standUpDays.map(
                        (days, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center p-2 hover:bg-gray-50 rounded"
                          >
                            <div>
                              <span>{days}</span>
                            </div>
                            <button
                              onClick={() => handleRemoveSchedule(index, "day")}
                              className="text-red-500 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        )
                      )}
                    </div>
                    <div className="w-1/2">
                      <p className="text-sm font-bold">Times</p>
                      {selectedTeam.standUpConfig.standUpTimes.map(
                        (times, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center p-2 hover:bg-gray-50 rounded"
                          >
                            <div>
                              <span>{times}</span>
                            </div>
                            <button
                              onClick={() =>
                                handleRemoveSchedule(index, "time")
                              }
                              className="text-red-500 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Questions Tab */}
              {activeTab === "questions" && (
                <div className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <input
                        type="text"
                        value={newQuestion.text}
                        onChange={(e) =>
                          setNewQuestion({
                            ...newQuestion,
                            text: e.target.value,
                          })
                        }
                        placeholder="Add new question"
                        className="flex-1 p-2 border rounded-lg"
                      />
                      <CustomSelect
                        val={newQuestion.type}
                        handleChange={(_, __, value) =>
                          setNewQuestion({ ...newQuestion, type: value })
                        }
                        options={[
                          "Text",
                          "Multiple Choice",
                          "Select",
                          "CheckBox",
                          "Radio",
                        ]}
                        i={0}
                      />

                      <button
                        onClick={handleAddQuestion}
                        className="bg-green-primary text-white px-4 py-2 rounded-lg hover:bg-green-secondary"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>
                    {/* Show options input field when type is multiple_choice */}
                    {newQuestion.type === "multiple-choice" ||
                      newQuestion.type === "radio" ||
                      newQuestion.type === "checkbox" ||
                      (newQuestion.type === "select" && (
                        <div className="flex items-center space-x-4">
                          <input
                            type="text"
                            value={newQuestion.options}
                            onChange={(e) =>
                              setNewQuestion({
                                ...newQuestion,
                                options: e.target.value.split(","),
                              })
                            }
                            placeholder="Add options (comma-separated)"
                            className="flex-1 p-2 border rounded-lg"
                          />
                        </div>
                      ))}
                  </div>
                  <div className="space-y-2">
                    {selectedTeam.standUpConfig.questions.map((question) => (
                      <div
                        key={question.id}
                        className="flex justify-between items-center p-2 hover:bg-gray-50 rounded"
                      >
                        <span>{question.text}</span>
                        <div className="flex space-x-2">
                          {/* <button className="text-green-primary hover:text-green-secondary">
                            <PencilIcon className="h-4 w-4" />
                          </button> */}
                          <button
                            onClick={() =>
                              handleRemoveQuestion(Number(question.id)!)
                            }
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reminders Tab */}
              {activeTab === "reminders" && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <input
                      type="time"
                      value={newReminder}
                      onChange={(e) => setNewReminder(e.target.value)}
                      className="p-2 border rounded-lg"
                    />
                    <button
                      onClick={handleAddReminder}
                      className="bg-green-primary text-white px-4 py-2 rounded-lg hover:bg-green-secondary"
                    >
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
                          <button
                            onClick={() => handleRemoveReminder(index)}
                            className="text-red-500 hover:text-red-600"
                          >
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
