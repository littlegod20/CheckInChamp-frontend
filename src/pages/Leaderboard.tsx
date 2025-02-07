import React from "react";

interface LeaderboardEntry {
  name: string;
  kudosCount: number;
}

const mockLeaderboard: LeaderboardEntry[] = [
  { name: "@JohnDoe", kudosCount: 45 },
  { name: "@JaneSmith", kudosCount: 38 },
  { name: "@Alex", kudosCount: 32 },
];

const Leaderboard: React.FC = () => {
  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        🎉 Kudos Leaderboard 🎉
      </h2>
      <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
        <thead className="bg-gradient-to-r from-blue-500 to-blue-700 text-white">
          <tr>
            <th className="px-6 py-3 text-left">🏆 Rank</th>
            <th className="px-6 py-3 text-left">👤 Name</th>
            <th className="px-6 py-3 text-left">👏 Kudos</th>
          </tr>
        </thead>
        <tbody className="bg-gray-100 divide-y divide-gray-300">
          {mockLeaderboard.map((entry, index) => (
            <tr
              key={index}
              className={`hover:bg-gray-200 ${
                index === 0 ? "text-yellow-500 font-bold" : ""
              }`}
            >
              <td className="px-6 py-4">{index + 1}</td>
              <td className="px-6 py-4">{entry.name}</td>
              <td className="px-6 py-4">{entry.kudosCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
