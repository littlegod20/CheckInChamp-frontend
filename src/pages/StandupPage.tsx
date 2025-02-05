import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { fetchMember, fetchStandups, fetchTeams } from "@/store/store";
import { FormTypes } from "@/types/CardWithFormTypes";
import { StandUps } from "@/types/StandupResponseTypes";
import { Calendar1, CheckCircle, DownloadIcon, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

  const [selectedMember, setSelectedMember] = useState<string>("All Members"); // Filter by member

  const { standups, teams, members } = useAppSelector((state) => state.app);
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const formatStandups = (
    rawStandups: StandUps[],
    teams: FormTypes[]
  ): Standup[] => {
    // console.log("..loging", rawStandups);
    return rawStandups.map((record) => {
      // console.log("record date:", record.date)
      const standupDate = new Date(record.date);
      const today = new Date();
      // Normalize dates for comparison (ignoring time)
      today.setHours(0, 0, 0, 0);
      const normalizedStandupDate = new Date(standupDate);
      normalizedStandupDate.setHours(0, 0, 0, 0);
      const status = normalizedStandupDate < today ? "completed" : "pending";

      // Lookup team to get total members; fallback to 0 if not found

      const teamObj = teams.find(
        (team) => team.slackChannelId === record.slackChannelId
      );
      console.log("teamse444:", teams);
      console.log("teamObj:", teamObj);
      const totalMembers = teamObj ? teamObj.members.length : 0;

      return {
        id: record._id,
        team: record.teamName,
        date: standupDate.toISOString().split("T")[0], // "02-03-2025"
        time: standupDate.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }), // e.g., "02:20 PM"
        participants: record.responses ? record.responses.length : 0,
        totalMembers,
        status,
      };
    });
  };

  let formatted;

  if (standups && teams) {
    formatted = formatStandups(standups.standups, teams);
    // console.log("formatted:", formatted);
  }

  // Filtered standups
  const filteredStandups = formatted
    ? formatted.filter((standup) => {
        // Existing filters
        const teamMatch =
          selectedTeam === "All Teams" || standup.team === selectedTeam;
        const dateMatch = !selectedDate || standup.date === selectedDate;
        const statusMatch =
          selectedStatus === "All Statuses" ||
          standup.status === selectedStatus.toLowerCase();

        // Lookup team to get members
        const teamObj = teams.find((team) => team.name === standup.team);

        const memberMatch =
          selectedMember === "All Members" ||
          (teamObj && teamObj.members.includes(selectedMember));
        return teamMatch && dateMatch && statusMatch && memberMatch;
      })
    : [];

  // Statuses for filter dropdown
  const statuses = ["All Statuses", "Completed", "Pending"];

  useEffect(() => {
    dispatch(fetchStandups());
    dispatch(fetchTeams());
    dispatch(fetchMember());
  }, []);

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
            <option value="All Teams">All Teams</option>
            {teams.map((team) => (
              <option key={team.slackChannelId} value={team.name}>
                {team.name}
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
              onChange={(e) => {
                console.log("filtering date:", e.target.value);
                setSelectedDate(e.target.value);
              }}
              className="block w-full p-2 border border-gray-300 rounded-lg shadow-sm"
            />
            <Calendar1 className="h-5 w-5 absolute right-3 top-2.5 text-gray-400" />
          </div>
        </div>

        {/* Member filter */}
        <div className="flex-1">
          <label
            htmlFor="member"
            className="block text-sm font-medium text-gray-700"
          >
            Filter by Member
          </label>
          <select
            id="member"
            value={selectedMember}
            onChange={(e) => setSelectedMember(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm"
          >
            <option value="All Members">All Members</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
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
                className="hover:bg-gray-50 transition-colors hover:cursor-pointer"
                onClick={() => navigate(`/standups/${standup.id}`)}
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
