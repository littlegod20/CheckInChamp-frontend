import CustomSelect from "@/components/CustomSelect";
import MultitSelect from "@/components/MultitSelect";
import { api } from "@/services/api";
import { FormTypes, Questions } from "@/types/CardWithFormTypes";
import { convertTo12Hour } from "@/utils/helpers";
import { Check, Loader2, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { MultiValue } from "react-select";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { fetchTeams, fetchMember } from "../store/store";

const TeamsPage = () => {
  const [selectedTeam, setSelectedTeam] = useState<FormTypes | null>(null);
  const [activeTab, setActiveTab] = useState<
    "members" | "schedule" | "questions" | "reminders" | "moods"
  >("members");

  const dispatch = useAppDispatch();
  const { teams, members } = useAppSelector((state) => state.app);

  const [searchQuery, setSearchQuery] = useState("");

  const [, setTeams] = useState<FormTypes[] | null>(null);

  const [availableMembers, setAvailableMembers] = useState<
    { id: string; member: string }[]
  >([{ id: "", member: "" }]);

  const [loading, setLoading] = useState<
    "loading" | "failed" | "success" | "idle"
  >("idle");

  const [moodTime, setMoodTime] = useState("");
  const [savedMoodTime, setSavedMoodTime] = useState("");
  const [moodMsg, setMoodMsg] = useState("");

  const [newSchedule, setNewSchedule] = useState({ day: "", time: "" });
  const [newReminder, setNewReminder] = useState("");
  const [newQuestion, setNewQuestion] = useState<Questions>({
    text: "",
    type: "",
    options: [],
  });

  // handle add mood check in time
  const handleAddMoodTime = async () => {
    if (!selectedTeam || !moodTime) {
      alert("Please select a team and enter a mood time.");
      return;
    }

    try {
      const to12Hour = convertTo12Hour(moodTime);

      const response = await api.post("/mood", {
        teamName: selectedTeam.name,
        slackChannelId: selectedTeam.slackChannelId,
        moodTime: to12Hour,
      });

      // setMoodMsg(response.data.message);

      if (!response) {
        throw new Error(response);
      }

      if (response.status === 201) {
        alert("Mood time saved successfully!");
        setSavedMoodTime(response.data.data.moodTime); // Save the mood time
        setMoodTime(""); // Clear the input field
      } else {
        alert("Failed to save mood time.");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // console.error(
      //   "Error saving mood time:",
      //   error instanceof Error ? error.response.data.message : error
      // );
      setMoodMsg(error?.response?.data.message as string);
    }
  };

  const handleDeleteMoodTime = async () => {
    if (!selectedTeam) {
      alert("Please select a team.");
      return;
    }

    try {
      const response = await api.delete("/mood", {
        data: {
          teamName: selectedTeam.name,
          slackChannelId: selectedTeam.slackChannelId,
        },
      });

      if (response.status === 200) {
        alert("Mood time deleted successfully!");
        setSavedMoodTime(""); // Clear the saved mood time
      } else {
        alert("Failed to delete mood time.");
      }
    } catch (error) {
      console.error("Error deleting mood time:", error);
      alert("Error deleting mood time.");
    }
  };

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
              newQuestion.type === "multiple-choice" ||
              newQuestion.type === "checkbox" ||
              newQuestion.type === "select" ||
              newQuestion.type === "radio"
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
    // dispatch(updateTeam(updateTeam))
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
      setTimeout(() => {
        setLoading("idle");
      }, 2000);
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

  useEffect(() => {
    dispatch(fetchTeams());
    dispatch(fetchMember());
  }, [dispatch]);

  useEffect(() => {
    const fetchMoodTimes = async () => {
      const response = await api.get("mood/times");
      console.log("MoodTimes:", response.data.data[0]);
      setSavedMoodTime(response.data.data[0]?.moodTime);
    };

    setAvailableMembers(
      members.map((item: { id: string; name: string }) => ({
        id: item.id as string,
        member: item.name,
      }))
    );

    fetchMoodTimes();
  }, [loading, teams, members]);

  console.log("savedMoodTime", savedMoodTime);

  // Format available members for react-select
  const memberOptions =
    availableMembers &&
    availableMembers.map((member) => ({
      value: member.id,
      label: member.member,
    }));

  return (
    <div className="p-6 bg-gray-50  text-black-secondary md:h-screen">
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
          <div className="space-y-3 overflow-y-scroll h-96">
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
            <div className="flex space-x-4 border-b mb-6 ">
              {(
                [
                  "members",
                  "schedule",
                  "questions",
                  "reminders",
                  "moods",
                ] as const
              ).map((tab) => (
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
              ))}
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
                    {(newQuestion.type === "multiple-choice" ||
                      newQuestion.type === "radio" ||
                      newQuestion.type === "checkbox" ||
                      newQuestion.type === "select") && (
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
                    )}
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

              {/* mood checkin tab */}
              {activeTab === "moods" && (
                <div className="space-y-4">
                  {/* Mood Time Input */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 w-1/2">
                      <input
                        type="time"
                        value={moodTime}
                        onChange={(e) => setMoodTime(e.target.value)}
                        className="p-2 border rounded-lg"
                      />
                      <button
                        onClick={handleAddMoodTime}
                        className="bg-green-primary text-white px-4 py-2 rounded-lg hover:bg-green-secondary"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Display Saved Mood Time */}
                  <div>
                    <p className="text-sm font-bold">Mood Check-In Time:</p>
                    {savedMoodTime ? (
                      <div className="flex items-center gap-2">
                        <p>{savedMoodTime}</p>
                        <button
                          onClick={handleDeleteMoodTime}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <p>Not set</p>
                    )}
                    <p className="text-xs text-red-600">{moodMsg}</p>
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
