import{ useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { FrownIcon, MehIcon, SmileIcon } from "lucide-react";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface MoodEntry {
  id: string;
  date: string;
  team: string;
  member: string;
  mood: "happy" | "neutral" | "sad";
}

const MoodTrackingPage = () => {
  const [selectedTeam, setSelectedTeam] = useState<string>("All Teams");
  const [selectedMember, setSelectedMember] = useState<string>("All Members");

  // Dummy data
  const moodEntries: MoodEntry[] = [
    {
      id: "1",
      date: "2023-10-01",
      team: "Engineering Team",
      member: "Alice",
      mood: "happy",
    },
    {
      id: "2",
      date: "2023-10-01",
      team: "Engineering Team",
      member: "Bob",
      mood: "neutral",
    },
    {
      id: "3",
      date: "2023-10-02",
      team: "Design Team",
      member: "Charlie",
      mood: "sad",
    },
    {
      id: "4",
      date: "2023-10-02",
      team: "Marketing Team",
      member: "Diana",
      mood: "happy",
    },
    {
      id: "5",
      date: "2023-10-03",
      team: "Engineering Team",
      member: "Alice",
      mood: "neutral",
    },
  ];

  // Filtered mood entries
  const filteredMoodEntries = moodEntries.filter((entry) => {
    const teamMatch =
      selectedTeam === "All Teams" || entry.team === selectedTeam;
    const memberMatch =
      selectedMember === "All Members" || entry.member === selectedMember;
    return teamMatch && memberMatch;
  });

  // Teams for filter dropdown
  const teams = [
    "All Teams",
    "Engineering Team",
    "Design Team",
    "Marketing Team",
  ];

  // Members for filter dropdown
  const members = ["All Members", "Alice", "Bob", "Charlie", "Diana"];

  // Mood trends data for the chart
  const moodTrendsData = {
    labels: ["2023-10-01", "2023-10-02", "2023-10-03"],
    datasets: [
      {
        label: "Happy",
        data: [2, 1, 1], // Number of happy moods per day
        borderColor: "#10B981",
        backgroundColor: "#10B981",
      },
      {
        label: "Neutral",
        data: [1, 0, 1], // Number of neutral moods per day
        borderColor: "#F59E0B",
        backgroundColor: "#F59E0B",
      },
      {
        label: "Sad",
        data: [0, 1, 0], // Number of sad moods per day
        borderColor: "#EF4444",
        backgroundColor: "#EF4444",
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-black-secondary">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mood Tracking</h1>
        <p className="text-gray-600 mt-2">
          Track and analyze team moods over time
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

        {/* Member Filter */}
        <div className="flex-1">
          <label
            htmlFor="member"
            className="block text-sm font-medium text-gray-700"
          >
            Member
          </label>
          <select
            id="member"
            value={selectedMember}
            onChange={(e) => setSelectedMember(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm"
          >
            {members.map((member) => (
              <option key={member} value={member}>
                {member}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mood Trends Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Mood Trends</h2>
        <Line
          data={moodTrendsData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "top" },
              title: { display: false },
            },
          }}
        />
      </div>

      {/* Mood Entries Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Team
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Member
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mood
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredMoodEntries.map((entry) => (
              <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {entry.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {entry.team}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {entry.member}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {entry.mood === "happy" && (
                    <span className="text-green-600 flex items-center">
                      <SmileIcon className="h-5 w-5 mr-2" />
                      Happy
                    </span>
                  )}
                  {entry.mood === "neutral" && (
                    <span className="text-yellow-600 flex items-center">
                      <MehIcon className="h-5 w-5 mr-2" />
                      Neutral
                    </span>
                  )}
                  {entry.mood === "sad" && (
                    <span className="text-red-600 flex items-center">
                      <FrownIcon className="h-5 w-5 mr-2" />
                      Sad
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredMoodEntries.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No mood entries found matching your filters.
          </p>
        </div>
      )}
    </div>
  );
};

export default MoodTrackingPage;
