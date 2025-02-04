import Header from "../components/Header";
import { Button } from "@/components/ui/button";
import CardWithForm from "@/components/CardWithForm";
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { ChartBar, Clipboard, Clock, User } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { fetchStandups, fetchTeams } from "@/store/store";
import { FormTypes } from "@/types/CardWithFormTypes";
import {
  calculateOverallParticipationRate,
  getPendingRemindersCount,
} from "@/utils/helpers";
import {
  StandupResponseTypes,
  StatusTypes,
} from "@/types/StandupResponseTypes";

const HomePage: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [todayStandups, setTodayStandup] = useState<number>(0);

  const dispatch = useAppDispatch();
  const { teams, standups } = useAppSelector((state) => state.app);

  const handleModal = () => {
    setIsOpen(!isOpen);
  };

  // sorting standups by date (most recent first)
  const sortedStandups = standups?.statuses
    ? [...standups.statuses].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    : [];

  const getTodayStandups = (teams: Array<FormTypes>) => {
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
    const todayStandups = teams.filter((team) =>
      team.standUpConfig?.standUpDays?.includes(today)
    );
    setTodayStandup(todayStandups.length);
  };

  const getParticipationDataForTeam = (
    teamId: string,
    standups: StandupResponseTypes
  ) => {
    // Filter standups for the given team and exclude errors
    const teamStandups = standups.statuses
      .filter((item) => item.slackChannelId === teamId && !item.error)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    console.log("teamsStandups:", teamStandups);

    // Map each standup to an object containing a formatted date and a numerical participation rate
    return teamStandups.map((item) => ({
      name: new Date(item.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      participation: parseFloat(item.participationRate.replace("%", "")),
    }));
  };

  const getStandupCompletionData = (
    teams: FormTypes[],
    standups: StatusTypes[] = []
  ) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date

    return teams
      .filter(
        (item) =>
          item.name !== "all-check-in-champ" &&
          item.name !== "new-channel" &&
          item.name !== "social"
      )
      .splice(0, 4)
      .map((team) => {
        // Get standups for this team that are valid (i.e., no error)
        const teamStandups = standups.filter(
          (standup) =>
            standup.slackChannelId === team.slackChannelId && !standup.error
        );

        // Count completed and pending standups
        let completed = 0;
        let pending = 0;
        teamStandups.forEach((standup) => {
          const standupDate = new Date(standup.date);
          standupDate.setHours(0, 0, 0, 0); // Normalize standup date
          if (standupDate < today) {
            completed++;
          } else {
            pending++;
          }
        });

        return {
          name: team.name.split("-").join(" "), // or any display name for the team
          completed,
          pending,
        };
      });
  };

  // Example usage:
  const standupData = standups
    ? getStandupCompletionData(teams, standups?.statuses as StatusTypes[])
    : [];

  console.log("standupDAta:", standups);

  const participationData =
    sortedStandups.length > 0
      ? getParticipationDataForTeam(
          sortedStandups[0].slackChannelId,
          standups as StandupResponseTypes
        )
      : [];

  useEffect(() => {
    dispatch(fetchTeams());
    dispatch(fetchStandups());
  }, [dispatch]);

  useEffect(() => {
    getTodayStandups(teams);
  }, [teams]);

  const pendingRemindersCount = getPendingRemindersCount(teams);

  return (
    <div className="text-black-secondary">
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="pb-3 text-black-primary font-bold">
          <Header
            title="Welcome to Check In Champ"
            description="Streamline your team's daily standups and reporting with ease."
            Button={
              <Button className="bg-green-primary" onClick={handleModal}>
                Create Team
              </Button>
            }
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 text-gray-500">
          {/* Total Teams */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center">
              <User className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <p className="text-gray-500 text-sm">Total Teams</p>
                <p className="text-2xl font-bold">{teams.length}</p>
              </div>
            </div>
          </div>

          {/* Standups Today */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center">
              <Clipboard className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <p className="text-gray-500 text-sm">Standups Today</p>
                <p className="text-2xl font-bold">{todayStandups}</p>
              </div>
            </div>
          </div>

          {/* Participation Rate */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center">
              <ChartBar className="h-8 w-8 text-purple-500 mr-3" />
              <div>
                <p className="text-gray-500 text-sm">
                  Overall Participation Rate
                </p>
                <p className="text-2xl font-bold">
                  {standups
                    ? calculateOverallParticipationRate(standups.statuses)
                    : null}
                </p>
              </div>
            </div>
          </div>

          {/* Pending Reminders */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-500 mr-3" />
              <div>
                <p className="text-gray-500 text-sm">Pending Reminders</p>
                <p className="text-2xl font-bold">{pendingRemindersCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Participation Trends */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">
              {sortedStandups.length > 0
                ? sortedStandups[0].teamName
                    .split("-")
                    .join(" ")
                    .toUpperCase() + " Participation Trends"
                : "Participation Trends"}
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={participationData}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="participation"
                    stroke="#3B82F6"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Standup Completion */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Standup Completion</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={standupData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="completed" fill="#10B981" />
                  <Bar dataKey="pending" fill="#F59E0B" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Standups</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-3">Team</th>
                  <th className="pb-3">Time</th>
                  <th className="pb-3">Participants</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {sortedStandups.length > 0 ? (
                  sortedStandups
                    .filter((item) => !item.error)
                    .map((item, index) => {
                      const standupDate = new Date(item.date);
                      const today = new Date();
                      today.setHours(0, 0, 0, 0); // Normalize today's date (remove time part)

                      const status =
                        standupDate < today ? "Completed" : "Pending";
                      const statusClasses =
                        status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800";

                      return (
                        <tr key={index} className="border-b last:border-b-0">
                          <td className="py-3">{item.teamName}</td>
                          <td className="py-3">
                            {new Date(item.date).toISOString().split("T")[0]}
                          </td>
                          <td className="py-3">
                            {teams.map((team) =>
                              team.slackChannelId === item.slackChannelId
                                ? item.status.filter(
                                    (i) => i.status === "responded"
                                  ).length +
                                  "/" +
                                  team.members.length
                                : null
                            )}
                          </td>
                          <td className="py-3">
                            <span
                              className={`px-2 py-1 rounded-full text-sm ${statusClasses}`}
                            >
                              {status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                ) : (
                  <tr>
                    <td>
                      <p>No recent standups available</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {isOpen && (
        <CardWithForm
          title="Create A Team"
          description="Create and configure your team's standups"
          onCancel={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default HomePage;
