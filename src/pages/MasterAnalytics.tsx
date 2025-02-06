import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Chart, Line } from "react-chartjs-2";
import {
  ArrowDown01Icon,
  ChartBarBigIcon,
  ChartBarIcon,
  ChartPieIcon,
  ClipboardCheckIcon,
  FrownIcon,
  MehIcon,
  Smile,
  ThumbsUpIcon,
} from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { api } from "@/services/api";
import { useAppSelector } from "@/hooks/hooks";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface AnalyticsData {
  standups: {
    completed: number;
    pending: number;
    avgParticipants: number;
    trends: { _id: string; count: number }[];
  };
  moods: {
    happy: number;
    neutral: number;
    sad: number;
    avgMood: number;
    trends: number[];
  };
  kudos: {
    given: number;
    topReceiver: { _id: string; count: 2 }[];
    topCategory: { _id: string; count: 2 }[];
  };
  polls: {
    total: { total: number }[];
    avgParticipation: { avg: number }[];
    mostPopular: { _id: string; count: number }[];
  };
  teamComparison?: { team: string; kudos: number; polls: number }[];
}

const MasterAnalyticsPage = () => {
  const [selectedTeam, setSelectedTeam] = useState<string>("All Teams");
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });

  const { members } = useAppSelector((state) => state.app);

  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [teams, setTeams] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Dummy data
  // const analyticsData = {
  //   standups: {
  //     completed: 42,
  //     pending: 8,
  //     avgParticipants: 8.2,
  //     trends: [5, 7, 6, 8, 7, 9, 6], // Weekly trend
  //   },
  //   moods: {
  //     happy: 65,
  //     neutral: 25,
  //     sad: 10,
  //     avgMood: 4.1, // 1-5 scale
  //   },
  //   kudos: {
  //     given: 128,
  //     topReceiver: "Alice",
  //     topCategory: "Teamwork",
  //   },
  //   polls: {
  //     total: 15,
  //     avgParticipation: 82,
  //     mostPopular: "Project Priorities",
  //   },
  // };

  // Teams for filter dropdown
  // const teams = ["All Teams", "Engineering", "Design", "Marketing"];

  // // Combined trends data
  // const combinedTrendsData = {
  //   labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  //   datasets: [
  //     {
  //       type: "line" as const,
  //       label: "Standup Completion",
  //       data: analyticsData.standups.trends,
  //       borderColor: "#3B82F6",
  //       backgroundColor: "#3B82F6",
  //       yAxisID: "y",
  //     },
  //     {
  //       type: "bar" as const,
  //       label: "Happy Moods",
  //       data: [12, 15, 13, 14, 16, 12, 11],
  //       backgroundColor: "#10B981",
  //       yAxisID: "y1",
  //     },
  //   ],
  // };

  // // Comparison chart data
  // const comparisonData = {
  //   labels: teams.slice(1),
  //   datasets: [
  //     {
  //       label: "Kudos Given",
  //       data: [45, 32, 51],
  //       backgroundColor: "#8B5CF6",
  //     },
  //     {
  //       label: "Poll Participation",
  //       data: [85, 78, 92],
  //       backgroundColor: "#F59E0B",
  //     },
  //   ],
  // };

  // Fetch teams and analytics data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch teams list
        const teamsRes = await api.get("/teams");
        const teamNames = [
          "All Teams",
          ...teamsRes.data.map((t: { name: string }) => t.name),
        ];
        setTeams(teamNames);

        // Fetch analytics data
        const analyticsRes = await api.get("/master/analytics", {
          params: {
            team: selectedTeam === "All Teams" ? undefined : selectedTeam,
            startDate: dateRange.start,
            endDate: dateRange.end,
          },
        });

        setAnalyticsData(analyticsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedTeam, dateRange.start, dateRange.end]);

  useEffect(() => {
    console.log("analytics data:", analyticsData);
  }, [analyticsData]);

  // Format data for charts
  const combinedTrendsData = {
    labels:
      analyticsData?.standups.trends.map((t: { _id: string; count: number }) =>
        new Date(t._id).toLocaleDateString("en-US", { weekday: "short" })
      ) || [],
    datasets: [
      {
        type: "line" as const,
        label: "Standup Completion",
        data:
          analyticsData?.standups.trends.map(
            (t: { _id: string; count: number }) => t.count
          ) || [],
        borderColor: "#3B82F6",
        backgroundColor: "#3B82F6",
        yAxisID: "y",
      },
      {
        type: "bar" as const,
        label: "Happy Moods",
        data: analyticsData?.moods.trends || [],
        backgroundColor: "#10B981",
        yAxisID: "y1",
      },
    ],
  };

  const comparisonData = {
    labels: teams.slice(1),
    datasets: [
      {
        label: "Kudos Given",
        data: teams
          .slice(1)
          .map(
            (team) =>
              analyticsData?.teamComparison?.find(
                (t: { team: string; kudos: number; polls: number }) =>
                  t.team === team
              )?.kudos || 0
          ),
        backgroundColor: "#8B5CF6",
      },
      {
        label: "Poll Participation",
        data: teams
          .slice(1)
          .map(
            (team) =>
              analyticsData?.teamComparison?.find(
                (t: { team: string; kudos: number; polls: number }) =>
                  t.team === team
              )?.polls || 0
          ),
        backgroundColor: "#F59E0B",
      },
    ],
  };

  if (loading) {
    return <div className="p-6 text-center">Loading analytics...</div>;
  }

  if (!analyticsData) {
    return (
      <div className="p-6 text-center text-red-500">
        Error loading analytics data
      </div>
    );
  }

  // Recent activities
  const recentActivities = [
    {
      type: "standup",
      team: "Engineering",
      date: "2023-10-07",
      details: "Daily standup completed",
    },
    {
      type: "mood",
      team: "Design",
      date: "2023-10-07",
      details: "Team mood check-in completed",
    },
    {
      type: "kudos",
      team: "Marketing",
      date: "2023-10-06",
      details: "5 kudos given",
    },
    {
      type: "poll",
      team: "Engineering",
      date: "2023-10-06",
      details: "New poll created: Project Priorities",
    },
  ];

  console.log("members:", members);

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-black-secondary">
      {/* Header */}
      <Header
        title="Master Analytics"
        description="Comprehensive insights across all team activities"
        Button={
          <Button className="bg-green-primary text-white px-4 py-2 rounded-lg hover:bg-green-secondary flex items-center">
            <ArrowDown01Icon className="h-5 w-5 mr-2" />
            Export Report
          </Button>
        }
      />

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Team
          </label>
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="w-full p-2 border rounded-lg"
          >
            {teams.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <div className="relative">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange({ ...dateRange, start: e.target.value })
              }
              className="w-full p-2 border rounded-lg"
            />
            {/* <CalendarIcon className="h-5 w-5 absolute right-2 top-2.5 text-gray-400" /> */}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <div className="relative">
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) =>
                setDateRange({ ...dateRange, end: e.target.value })
              }
              className="w-full p-2 border rounded-lg"
            />
            {/* <CalendarIcon className="h-5 w-5 absolute right-2 top-2.5 text-gray-400" /> */}
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center mb-2">
            <ClipboardCheckIcon className="h-6 w-6 text-blue-500 mr-2" />
            <h3 className="font-semibold">Standups</h3>
          </div>
          <div className="text-3xl font-bold flex gap-1">
            {analyticsData.standups.completed}
            <span className="text-xs font-medium">completed</span>
          </div>
          <div className="text-sm text-gray-600 flex flex-col">
            <p>
              {analyticsData.standups.pending}{" "}
              <span className="text-xs pl-1 font-medium">pending</span>
            </p>
            <p>
              {analyticsData.standups.avgParticipants}
              <span className="text-xs pl-1 font-medium">avg. participants</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center mb-2">
            <ChartBarBigIcon className="h-6 w-6 text-green-500 mr-2" />
            <h3 className="font-semibold">Mood</h3>
          </div>
          <div className="text-3xl font-bold pb-2">
            {analyticsData.moods.avgMood}
          </div>
          <div className="text-sm text-gray-600 font-bold flex gap-2">
            <div className="flex gap-1 items-center flex-col-reverse justify-center">
              <Smile className="text-green-500" size={18} />
              {analyticsData.moods.happy}
            </div>
            <span className="flex gap-1 items-center flex-col-reverse justify-center">
              <FrownIcon className="text-red-500" size={18} />
              {analyticsData.moods.sad}
            </span>
            <span className="flex gap-1 items-center flex-col-reverse justify-center">
              <MehIcon className="text-yellow-500" size={18} />
              {analyticsData.moods.neutral}
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center mb-2">
            <ThumbsUpIcon className="h-6 w-6 text-purple-500 mr-2" />
            <h3 className="font-semibold">Kudos</h3>
          </div>
          <div className="text-3xl font-bold">{analyticsData.kudos.given}</div>
          <div className="text-sm text-gray-600">
            <p className="capitalize">
              <span className="text-xs font-medium pr-2">Top Member:</span>
              {
                members.find(
                  (item) => item.id === analyticsData.kudos.topReceiver[0]?._id
                )?.name
              }
            </p>
            <p className="capitalize">
              <span className="text-xs font-medium pr-2">Top category:</span>
              {analyticsData.kudos.topCategory[0]?._id}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center mb-2">
            <ChartPieIcon className="h-6 w-6 text-orange-500 mr-2" />
            <h3 className="font-semibold">Polls</h3>
          </div>
          <div className="text-3xl font-bold flex gap-1">
            {analyticsData.polls.total[0]?.total}{" "}
            <p className="text-xs font-medium">total polls</p>
          </div>
          <div className="text-sm text-gray-600">
            <p>
              {" "}
              <span className="text-xs font-medium">Avg:</span>{" "}
              {analyticsData.polls.avgParticipation[0]?.avg.toFixed(2)}{" "}
            </p>
            <p className="line-clamp-2 w-full">
              {" "}
              <span className="text-xs font-medium">Most Popular:</span> "
              {analyticsData.polls.mostPopular[0]?._id}"
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Activity Trends</h3>
          <div className="h-64">
            <Chart
              type="bar"
              data={combinedTrendsData}
              options={{
                responsive: true,
                scales: {
                  y: { type: "linear", display: true, position: "left" },
                  y1: { type: "linear", display: true, position: "right" },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Team Comparison</h3>
          <div className="h-64">
            <Line data={comparisonData} options={{ responsive: true }} />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div
              key={index}
              className="flex items-center p-3 hover:bg-gray-50 rounded-lg"
            >
              <div className="flex-shrink-0 mr-4">
                {activity.type === "standup" && (
                  <ClipboardCheckIcon className="h-6 w-6 text-blue-500" />
                )}
                {activity.type === "mood" && (
                  <ChartBarIcon className="h-6 w-6 text-green-500" />
                )}
                {activity.type === "kudos" && (
                  <ThumbsUpIcon className="h-6 w-6 text-purple-500" />
                )}
                {activity.type === "poll" && (
                  <ChartPieIcon className="h-6 w-6 text-orange-500" />
                )}
              </div>
              <div className="flex-1">
                <div className="font-medium">{activity.team} Team</div>
                <div className="text-sm text-gray-600">{activity.details}</div>
              </div>
              <div className="text-sm text-gray-500">{activity.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MasterAnalyticsPage;
