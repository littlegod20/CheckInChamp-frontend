import React, { useState } from "react";
import Navbar from "../Navbar";

interface Kudos {
  date: string;
  from: string;
  to: string;
  category: string;
  reason: string;
}

const mockKudos: Kudos[] = [
  { date: "2025-01-25", from: "@JaneSmith", to: "@JohnDoe", category: "Teamwork", reason: "Great help on the project!" },
  { date: "2025-01-24", from: "@JohnDoe", to: "@JaneSmith", category: "Creativity", reason: "Amazing presentation ideas!" },
  { date: "2025-01-23", from: "@Alice", to: "@Bob", category: "Leadership", reason: "Excellent team leadership!" },
  { date: "2025-01-22", from: "@Bob", to: "@Charlie", category: "Communication", reason: "Clear and effective communication!" },
];

const KudosHistory: React.FC = () => {
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [timeframeFilter, setTimeframeFilter] = useState<string>("");

  // Filtered kudos based on selected category and timeframe
  const filteredKudos = mockKudos.filter((kudos) => {
    const matchesCategory = categoryFilter ? kudos.category === categoryFilter : true;
    const matchesTimeframe = timeframeFilter ? kudos.date === timeframeFilter : true;
    return matchesCategory && matchesTimeframe;
  });

  return (
    <div>
      <Navbar />
      <h2 className="text-xl font-bold mb-4">Kudos History</h2>

      {/* Filters Section */}
      <div className="mb-4 flex gap-4">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Filter by Category</option>
          <option value="Teamwork">Teamwork</option>
          <option value="Creativity">Creativity</option>
          <option value="Leadership">Leadership</option>
          <option value="Communication">Communication</option>
        </select>

        <select
          value={timeframeFilter}
          onChange={(e) => setTimeframeFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Filter by Date</option>
          {mockKudos.map((kudos, index) => (
            <option key={index} value={kudos.date}>
              {kudos.date}
            </option>
          ))}
        </select>
      </div>

      {/* Kudos History Table */}
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border px-4 py-2">Date</th>
            <th className="border px-4 py-2">From</th>
            <th className="border px-4 py-2">To</th>
            <th className="border px-4 py-2">Category</th>
            <th className="border px-4 py-2">Reason</th>
          </tr>
        </thead>
        <tbody>
          {filteredKudos.map((kudos, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{kudos.date}</td>
              <td className="border px-4 py-2">{kudos.from}</td>
              <td className="border px-4 py-2">{kudos.to}</td>
              <td className="border px-4 py-2">{kudos.category}</td>
              <td className="border px-4 py-2">{kudos.reason}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default KudosHistory;
