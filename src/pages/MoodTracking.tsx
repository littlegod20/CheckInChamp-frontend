import { useState, useEffect } from "react";
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
import { Bar, Line } from "react-chartjs-2";
import { FrownIcon, MehIcon, SmileIcon } from "lucide-react";
import CustomHeatmap from "@/components/CustomHeatMap";
import Header from "@/components/Header";
import { MoodEntry } from "@/types/MoodTypes";
import { useAppDispatch } from "@/hooks/hooks";
import { fetchMember, fetchMoodData, fetchTeams } from "@/store/store";
import { FormTypes } from "@/types/CardWithFormTypes";

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

type HeatmapCell = {
  x: number;
  y: number;
  value: number;
  mood: "happy" | "neutral" | "sad";
};

interface Members {
  name: string;
  id: string;
}

const MoodTrackingPage = () => {
  const [selectedTeam, setSelectedTeam] = useState<string>("All Teams");
  const [selectedMember, setSelectedMember] = useState<string>("All Members");
  const [allTeams, setAllTeams] = useState<Partial<FormTypes[]>>([]);
  const [allMembers, setAllMembers] = useState<Members[]>([]);
  const [formatMood, setFormatMood] = useState<MoodEntry[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(5);
  const [pagination, setPagination] = useState<{
    page: number;
    total: number;
    totalPages: number;
  }>({
    total: 0,
    page: 1,
    totalPages: 1,
  });

  const dispatch = useAppDispatch();

  // Fetch all teams and members on mount
  useEffect(() => {
    dispatch(fetchTeams()).then((action) => {
      if (fetchTeams.fulfilled.match(action)) {
        setAllTeams([{ name: "All Teams" }, ...action.payload]);
      }
    });

    dispatch(fetchMember()).then((action) => {
      if (fetchMember.fulfilled.match(action)) {
        setAllMembers([
          { name: "All Members", id: "All Members" },
          ...action.payload,
        ]);
      }
    });
  }, [dispatch]);

  // Fetch mood data when filters change
  useEffect(() => {
    dispatch(
      fetchMoodData({
        team: selectedTeam !== "All Teams" ? selectedTeam : undefined,
        member: selectedMember !== "All Members" ? selectedMember : undefined,
        page: currentPage,
        limit: limit,
      })
    ).then((action) => {
      if (fetchMoodData.fulfilled.match(action)) {
        console.log("action:", action);
        const transformedData = action.payload.data.map((entry: MoodEntry) => ({
          date: new Date(entry.date).toISOString().split("T")[0],
          teamName: entry.teamName,
          userName: entry.userName,
          mood: entry.mood,
          userId: entry.userId,
        }));
        setFormatMood(transformedData);
        setPagination(action.payload.pagination);
      }
    });
  }, [selectedTeam, selectedMember, dispatch, limit, currentPage]);

  // Filtered mood entries
  const filteredMoodEntries = formatMood.filter((entry) => {
    // console.log("entry.teamName:", entry.teamName);
    const teamMatch =
      selectedTeam === "All Teams" || entry.teamName === selectedTeam;
    const memberMatch =
      selectedMember === "All Members" || entry.userName === selectedMember;
    return teamMatch && memberMatch;
  });

  // Mood trends data for the chart
  const moodTrendsData = {
    labels: Array.from(new Set(formatMood.map((entry) => entry.date))), // Unique dates
    datasets: [
      {
        label: "Happy",
        data: formatMood
          .filter((entry) => entry.mood === "happy")
          .reduce((acc, entry) => {
            acc[entry.date] = (acc[entry.date] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
        borderColor: "#10B981",
        backgroundColor: "#10B981",
      },
      {
        label: "Neutral",
        data: formatMood
          .filter((entry) => entry.mood === "neutral")
          .reduce((acc, entry) => {
            acc[entry.date] = (acc[entry.date] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
        borderColor: "#F59E0B",
        backgroundColor: "#F59E0B",
      },
      {
        label: "Sad",
        data: formatMood
          .filter((entry) => entry.mood === "sad")
          .reduce((acc, entry) => {
            acc[entry.date] = (acc[entry.date] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
        borderColor: "#EF4444",
        backgroundColor: "#EF4444",
      },
    ],
  };

  // Determine chart type based on filters
  const getChartType = () => {
    if (selectedTeam !== "All Teams" && selectedMember === "All Members") {
      return "teamArea";
    } else if (
      selectedTeam !== "All Teams" &&
      selectedMember !== "All Members"
    ) {
      return "memberArea";
    } else if (
      selectedTeam === "All Teams" &&
      selectedMember !== "All Members"
    ) {
      return "memberHeatmap";
    }
    return "default";
  };

  // Generate data for team area chart
  const getTeamAreaData = () => {
    const dates = Array.from(
      new Set(filteredMoodEntries.map((e) => e.date))
    ).sort();

    return {
      labels: dates,
      datasets: ["happy", "neutral", "sad"].map((mood) => ({
        label: mood,
        data: dates.map(
          (date) =>
            filteredMoodEntries.filter(
              (e) => e.date === date && e.mood === mood
            ).length
        ),
        fill: true,
        backgroundColor: {
          happy: "#10B98130",
          neutral: "#F59E0B30",
          sad: "#EF444430",
        }[mood],
        borderColor: {
          happy: "#10B981",
          neutral: "#F59E0B",
          sad: "#EF4444",
        }[mood],
      })),
    };
  };

  // Generate data for member area chart
  const getMemberAreaData = () => {
    const dates = Array.from(
      new Set(filteredMoodEntries.map((e) => e.date))
    ).sort();
    const moodValues = { happy: 2, neutral: 1, sad: 0 };

    return {
      labels: dates,
      datasets: [
        {
          label: "Mood Level",
          data: dates.map((date) => {
            const entry = filteredMoodEntries.find((e) => e.date === date);
            return entry ? moodValues[entry.mood] : null;
          }),
          fill: true,
          backgroundColor: "#3B82F630",
          borderColor: "#3B82F6",
        },
      ],
    };
  };

  // Generate data for member heatmap
  const getMemberHeatmapData = () => {
    const entries = filteredMoodEntries.filter(
      (e) => e.userName === selectedMember
    );

    console.log("entries:", entries);

    // Ensure we have at least one entry
    if (entries.length === 0) {
      return {
        data: [],
        xLabels: [],
        yLabels: [],
      };
    }

    const dates = Array.from(new Set(entries.map((e) => e.date))).sort();
    const teams = Array.from(new Set(entries.map((e) => e.teamName))).sort();

    const data: HeatmapCell[] = [];

    teams.forEach((team, yIndex) => {
      dates.forEach((date, xIndex) => {
        const entry = entries.find(
          (e) => e.teamName === team && e.date === date
        );

        if (entry) {
          data.push({
            x: xIndex,
            y: yIndex,
            value: { happy: 2, neutral: 1, sad: 0 }[entry.mood],
            mood: entry.mood,
          });
        }
      });
    });

    return {
      data,
      xLabels: dates.length > 0 ? dates : ["No dates"],
      yLabels: teams.length > 0 ? teams : ["No teams"],
    };
  };

  // Render appropriate chart
  const renderChart = () => {
    const chartType = getChartType();

    switch (chartType) {
      case "teamArea":
        return (
          <Line
            data={getTeamAreaData()}
            options={{
              responsive: true,
              elements: { line: { tension: 0.4 } },
              plugins: { legend: { position: "top" } },
            }}
          />
        );

      case "memberArea":
        return (
          <Line
            data={getMemberAreaData()}
            options={{
              responsive: true,
              scales: {
                y: {
                  min: 0,
                  max: 2,
                  ticks: {
                    callback: (value) =>
                      ["Sad", "Neutral", "Happy"][value as number],
                  },
                },
              },
              plugins: { legend: { display: false } },
            }}
          />
        );

      case "memberHeatmap": {
        const { data, xLabels, yLabels } = getMemberHeatmapData();
        console.log("Heatmap Data:", {
          data,
          xLabels,
          yLabels,
          dataLength: data.length,
          xLabelsLength: xLabels.length,
          yLabelsLength: yLabels.length,
        });
        return (
          <div className="">
            {data.length > 0 ? (
              <CustomHeatmap xLabels={xLabels} yLabels={yLabels} data={data} />
            ) : (
              <div className="text-center py-6 text-gray-500">
                No mood data available for this member across teams.
              </div>
            )}
          </div>
        );
      }

      default:
        return (
          <Bar
            data={moodTrendsData}
            options={{
              responsive: true,
              plugins: { legend: { position: "top" } },
            }}
          />
        );
    }
  };

  // useEffect(() => {
  //   console.log("formatted:", formatMood);
  //   console.log("allTeams:", allTeams);
  //   console.log("allMembers:", allMembers);
  //   console.log("selected member:", selectedMember);
  //   console.log("selected team:", selectedTeam);
  // }, [formatMood, allTeams, allMembers, selectedMember, selectedTeam]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-black-secondary">
      {/* Header */}
      <Header
        title="Mood Tracking"
        description="Track and analyze team moods over time"
      />

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 pt-4">
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
            {allTeams.map((team) => (
              <option key={team?.name} value={team?.name}>
                {team?.name}
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
            {allMembers.map((member) => (
              <option key={member.id} value={member.name}>
                {member.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Updated Chart Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">
          {getChartType() === "memberHeatmap"
            ? "Mood Distribution Across Teams"
            : "Mood Trends"}
        </h2>
        <div className="chart-container" style={{ minHeight: "400px" }}>
          {renderChart()}
        </div>
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
            {filteredMoodEntries.map((entry, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {entry.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {entry.teamName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {entry.userName}
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

      <div className="flex justify-between items-center mt-6 text-white">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-green-primary rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-black-secondary">
          Page {pagination?.page} of {pagination?.totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, pagination.totalPages))
          }
          disabled={currentPage === pagination?.totalPages}
          className="px-4 py-2 bg-green-primary rounded-lg disabled:opacity-50"
        >
          Next
        </button>
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
