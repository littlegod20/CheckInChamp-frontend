import { useEffect, useRef, useState } from "react";
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
import { AnalyticsDataTypes } from "@/types/AnalyticsDataTypes";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { fetchAnalytics } from "@/store/store";

import { jsPDF } from "jspdf";
import { saveAs } from "file-saver";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

const MasterAnalyticsPage = () => {
  const [selectedTeam, setSelectedTeam] = useState<string>("All Teams");
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });

  const [analyticsData, setAnalyticsData] = useState<AnalyticsDataTypes | null>(
    null
  );
  const [teams, setTeams] = useState<string[]>([]);

  const [exportFormat, setExportFormat] = useState<"pdf" | "csv">("pdf");
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([
    "standups",
    "moods",
    "kudos",
    "polls",
  ]);

  const chartRef = useRef<ChartJS>(null);

  const { masterAnalytics } = useAppSelector((state) => state.app);
  const dispatch = useAppDispatch();

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
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedTeam]);

  // fetching master analytics
  useEffect(() => {
    dispatch(
      fetchAnalytics({
        team: selectedTeam === "All Teams" ? undefined : selectedTeam,
        startDate: dateRange.start,
        endDate: dateRange.end,
      })
    );
  }, [dispatch, selectedTeam, dateRange.end, dateRange.start]);

  // setting master analytics
  useEffect(() => {
    setAnalyticsData(masterAnalytics);
  }, [masterAnalytics]);

  // Format data for charts
  const combinedTrendsData = {
    labels:
      analyticsData?.standups.trends.map(
        (t: {
          _id: string;
          completedStandups: number;
          date: string;
          standupCount: number;
          moodDistribution: {
            happy: number;
            neutral: number;
            sad: number;
          };
        }) => new Date(t._id).toLocaleDateString("en-US", { weekday: "short" })
      ) || [],
    datasets: [
      {
        type: "line" as const,
        label: "Standup Completion",
        data:
          analyticsData?.standups.trends.map(
            (t: {
              _id: string;
              completedStandups: number;
              date: string;
              standupCount: number;
              moodDistribution: {
                happy: number;
                neutral: number;
                sad: number;
              };
            }) => t.completedStandups
          ) || [],
        borderColor: "#3B82F6",
        backgroundColor: "#3B82F6",
        yAxisID: "y",
      },
      {
        type: "bar" as const,
        label: "Happy Moods",
        data:
          analyticsData?.standups.trends.map((m) => m.moodDistribution.happy) ||
          [],
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

  const handleExport = async () => {
    try {
      const response = await api.get("/analytics/export", {
        params: {
          team: selectedTeam === "All Teams" ? undefined : selectedTeam,
          startDate: dateRange.start,
          endDate: dateRange.end,
          metrics: selectedMetrics.join(","),
        },
        responseType: "blob",
      });

      const filename = `Analytics-Report-${new Date().toISOString()}.${exportFormat}`;
      saveAs(new Blob([response.data]), filename);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  const generateCustomReport = () => {
    const doc = new jsPDF();

    // Add report title
    doc.setFontSize(20);
    doc.text("Custom Analytics Report", 15, 20);

    // Add filters info
    doc.setFontSize(12);
    doc.text(`Team: ${selectedTeam}`, 15, 30);
    doc.text(`Date Range: ${dateRange.start} to ${dateRange.end}`, 15, 35);

    // Add metrics section
    doc.setFontSize(14);
    doc.text("Selected Metrics:", 15, 45);
    selectedMetrics.forEach((metric, index) => {
      doc.text(`${index + 1}. ${metric}`, 20, 50 + index * 5);
    });

    // Add simple chart (you can add more complex charts using chart images)
    if (chartRef.current?.canvas) {
      doc.addImage(chartRef.current.canvas, "PNG", 15, 100, 180, 80);
    }

    doc.save(`custom-report-${Date.now()}.pdf`);
  };

  const recentActivities = analyticsData?.recentActivities;

  const reportMetrics = [
    { id: "standups", label: "Standups" },
    { id: "moods", label: "Mood Trends" },
    { id: "kudos", label: "Kudos Distribution" },
    { id: "polls", label: "Poll Participation" },
  ];

  // Performance Data
  const performanceData = {
    standupCompletion: {
      labels: ["Completed", "Pending"],
      datasets: [
        {
          label: "Standups",
          data: [
            analyticsData?.standups.completed || 0,
            analyticsData?.standups.pending || 0,
          ],
          backgroundColor: ["#10B981", "#3B82F6"],
        },
      ],
    },
    moodDistribution: {
      labels: ["Happy", "Neutral", "Sad"],
      datasets: [
        {
          data: [
            analyticsData?.moods.happy || 0,
            analyticsData?.moods.neutral || 0,
            analyticsData?.moods.sad || 0,
          ],
          backgroundColor: ["#10B981", "#F59E0B", "#EF4444"],
        },
      ],
    },
  };

  // Engagement Data
  const engagementData = {
    kudosActivity: {
      labels:
        analyticsData?.standups.trends.map((t) =>
          new Date(t._id).toLocaleDateString("en-US", { weekday: "short" })
        ) || [],
      datasets: [
        {
          label: "Kudos Given",
          data: analyticsData?.kudos.trends || [],
          borderColor: "#8B5CF6",
          backgroundColor: "#8B5CF6",
        },
      ],
    },
    pollParticipation: {
      labels: analyticsData?.polls.mostPopular.map((p) => p._id) || [],
      datasets: [
        {
          label: "Votes",
          data: analyticsData?.polls.mostPopular.map((p) => p.count) || [],
          backgroundColor: "#F59E0B",
        },
      ],
    },
  };

  // // Trends Data
  // const trendsData = {
  //   labels:
  //     analyticsData?.standups.trends.map((t) =>
  //       new Date(t._id).toLocaleDateString("en-US", {
  //         month: "short",
  //         day: "numeric",
  //       })
  //     ) || [],
  //   datasets: [
  //     {
  //       label: "Standups Completed",
  //       data:
  //         analyticsData?.standups.trends.map((t) => t.completedStandups) || [],
  //       borderColor: "#3B82F6",
  //       backgroundColor: "#3B82F6",
  //     },
  //     {
  //       label: "Happy Moods",
  //       data:
  //         analyticsData?.standups.trends.map((t) => t.moodDistribution.happy) ||
  //         [],
  //       borderColor: "#10B981",
  //       backgroundColor: "#10B981",
  //     },
  //     {
  //       label: "Kudos Given",
  //       data: analyticsData?.kudos.trends || [],
  //       borderColor: "#8B5CF6",
  //       backgroundColor: "#8B5CF6",
  //     },
  //   ],
  // };

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-black-secondary">
      {/* Header */}
      <Header
        title="Master Analytics"
        description="Comprehensive insights across all team activities"
        Button={
          <div className="flex gap-2">
            <Button
              className="bg-green-primary text-white px-4 py-2 rounded-lg hover:bg-green-secondary flex items-center"
              onClick={handleExport}
            >
              <ArrowDown01Icon className="h-5 w-5 mr-2" />
              Export Report
            </Button>
            <Button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center"
              onClick={generateCustomReport}
            >
              <ChartBarIcon className="h-5 w-5 mr-2" />
              Generate Custom
            </Button>
          </div>
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
            {analyticsData?.standups.completed}
            <span className="text-xs font-medium">completed</span>
          </div>
          <div className="text-sm text-gray-600 flex flex-col">
            <p>
              {analyticsData?.standups.pending}{" "}
              <span className="text-xs pl-1 font-medium">pending</span>
            </p>
            <p>
              {analyticsData?.standups.avgParticipants}
              <span className="text-xs pl-1 font-medium">
                avg. participants
              </span>
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center mb-2">
            <ChartBarBigIcon className="h-6 w-6 text-green-500 mr-2" />
            <h3 className="font-semibold">Mood</h3>
          </div>
          {analyticsData && (
            <div className="text-3xl font-bold pb-2 flex">
              {analyticsData.moods.avgMood >= 1 &&
              analyticsData.moods.avgMood <= 1.5 ? (
                <MehIcon className="text-yellow-500" size={40} />
              ) : analyticsData.moods.avgMood >= 1.5 ? (
                <Smile className="text-green-500" size={40} />
              ) : analyticsData.moods.avgMood < 1 ? (
                <FrownIcon className="text-red-500" size={40} />
              ) : (
                ""
              )}
              <p className="font-medium text-xs">Overall mood</p>
            </div>
          )}
          <div className="text-sm text-gray-600 font-bold flex gap-2">
            <div className="flex gap-1 items-center flex-col-reverse justify-center">
              <Smile className="text-green-500" size={18} />
              {analyticsData?.moods.happy}
            </div>
            <span className="flex gap-1 items-center flex-col-reverse justify-center">
              <FrownIcon className="text-red-500" size={18} />
              {analyticsData?.moods.sad}
            </span>
            <span className="flex gap-1 items-center flex-col-reverse justify-center">
              <MehIcon className="text-yellow-500" size={18} />
              {analyticsData?.moods.neutral}
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center mb-2">
            <ThumbsUpIcon className="h-6 w-6 text-purple-500 mr-2" />
            <h3 className="font-semibold">Kudos</h3>
          </div>
          <div className="text-3xl font-bold">{analyticsData?.kudos.given}</div>
          <div className="text-sm text-gray-600">
            <p className="capitalize">
              <span className="text-xs font-medium pr-2">Top Member:</span>

              {analyticsData?.kudos.topReceiver[0]?._id}
            </p>
            <p className="capitalize">
              <span className="text-xs font-medium pr-2">Top category:</span>
              {analyticsData?.kudos.topCategory[0]?._id}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center mb-2">
            <ChartPieIcon className="h-6 w-6 text-orange-500 mr-2" />
            <h3 className="font-semibold">Polls</h3>
          </div>
          <div className="text-3xl font-bold flex gap-1">
            {analyticsData?.polls.total[0]?.total}{" "}
            <p className="text-xs font-medium">total polls</p>
          </div>
          <div className="text-sm text-gray-600">
            <p>
              {" "}
              <span className="text-xs font-medium">Avg:</span>{" "}
              {analyticsData?.polls.avgParticipation[0]?.avg.toFixed(2)}{" "}
            </p>
            <p className="line-clamp-2 w-full">
              {" "}
              <span className="text-xs font-medium">Most Popular:</span> "
              {analyticsData?.polls.mostPopular[0]?._id}"
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
              ref={chartRef}
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

      {/* Custom Reports Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">
          Custom Report Configuration
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {reportMetrics.map((metric) => (
            <div key={metric.id} className="flex items-center space-x-2">
              <Checkbox
                id={metric.id}
                checked={selectedMetrics.includes(metric.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedMetrics([...selectedMetrics, metric.id]);
                  } else {
                    setSelectedMetrics(
                      selectedMetrics.filter((m) => m !== metric.id)
                    );
                  }
                }}
              />
              <Label htmlFor={metric.id}>{metric.label}</Label>
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-4">
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value as "pdf" | "csv")}
            className="p-2 border rounded-lg"
          >
            <option value="pdf">PDF</option>
            <option value="csv">CSV</option>
          </select>
        </div>
      </div>

      {/* Team Insights Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Team Insights</h3>
        <Tabs defaultValue="performance">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="performance">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4">
                <h4 className="font-medium mb-2">Standup Completion Rate</h4>
                <div className="h-48">
                  <Chart
                    type="bar"
                    data={performanceData.standupCompletion}
                    options={{ responsive: true }}
                  />
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-medium mb-2">Mood Distribution</h4>
                <div className="h-48">
                  <Chart
                    type="pie"
                    data={performanceData.moodDistribution}
                    options={{ responsive: true }}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="engagement">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4">
                <h4 className="font-medium mb-2">Kudos Given/Received</h4>
                <div className="h-48">
                  <Chart
                    type="line"
                    data={engagementData.kudosActivity}
                    options={{ responsive: true }}
                  />
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-medium mb-2">Poll Participation</h4>
                <div className="h-48">
                  <Chart
                    type="bar"
                    data={engagementData.pollParticipation}
                    options={{ responsive: true }}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="trends">
            <div className="p-4">
              <h4 className="font-medium mb-2">Activity Trends Over Time</h4>
              <div className="h-64">
                {/* <Chart
                  type="line"
                  data={trendsData}
                  options={{
                    responsive: true,
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          stepSize: 1,
                        },
                      },
                    },
                  }}
                /> */}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
        <div className="space-y-4">
          {recentActivities &&
            recentActivities.map((activity, index) => (
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
                  <div className="font-medium">{activity.teamId}</div>
                  <div className="text-sm text-gray-600">
                    {activity.details}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(activity.date).toISOString().split("T")[0]}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MasterAnalyticsPage;
