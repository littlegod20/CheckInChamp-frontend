import Header from "../components/Header";
import { Button } from "@/components/ui/button";
import CardWithForm from "@/components/CardWithForm";
import React, { useState } from "react";
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

// Dummy data for demonstration
const participationData = [
  { name: "Mon", participation: 85 },
  { name: "Tue", participation: 92 },
  { name: "Wed", participation: 78 },
  { name: "Thu", participation: 88 },
  { name: "Fri", participation: 95 },
  { name: "Sat", participation: 70 },
  { name: "Sun", participation: 65 },
];

const standupData = [
  { name: "Team A", completed: 14, pending: 2 },
  { name: "Team B", completed: 12, pending: 4 },
  { name: "Team C", completed: 15, pending: 1 },
  { name: "Team D", completed: 10, pending: 5 },
];

const HomePage: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleModal = () => {
    setIsOpen(!isOpen);
  };

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
                <p className="text-2xl font-bold">24</p>
              </div>
            </div>
          </div>

          {/* Standups Today */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center">
              <Clipboard className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <p className="text-gray-500 text-sm">Standups Today</p>
                <p className="text-2xl font-bold">58/62</p>
              </div>
            </div>
          </div>

          {/* Participation Rate */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center">
              <ChartBar className="h-8 w-8 text-purple-500 mr-3" />
              <div>
                <p className="text-gray-500 text-sm">Participation Rate</p>
                <p className="text-2xl font-bold">93.5%</p>
              </div>
            </div>
          </div>

          {/* Pending Reminders */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-500 mr-3" />
              <div>
                <p className="text-gray-500 text-sm">Pending Reminders</p>
                <p className="text-2xl font-bold">14</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Participation Trends */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Participation Trends</h3>
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
                {[1, 2, 3, 4, 5].map((item) => (
                  <tr key={item} className="border-b last:border-b-0">
                    <td className="py-3">Team {item}</td>
                    <td className="py-3">2023-08-{10 + item} 09:00</td>
                    <td className="py-3">8/10</td>
                    <td className="py-3">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        Completed
                      </span>
                    </td>
                  </tr>
                ))}
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
