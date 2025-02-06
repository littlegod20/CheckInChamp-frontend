import { useEffect, useState, useMemo } from "react";
import { getKudos, getKudosLeaderboard } from "../../services/api";
import { format } from "date-fns";
import Navbar from "../Navbar";
import "../styles/KudosDashboard.css";

interface Kudos {
  _id: string;
  giver: { id: string; name: string };
  receiver: { id: string; name: string };
  category: string;
  reason: string;
  timestamp: string;
}

interface LeaderboardEntry {
  userId: string;
  name: string;
  rank: number;
  kudosCount: number;
}

const KudosDashboard = () => {
  const [kudos, setKudos] = useState<Kudos[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [visibleCount, setVisibleCount] = useState<number>(10);

  const categories = ["teamwork", "creativity", "leadership"];

  useEffect(() => {
    console.log("Updated Leaderboard State:", leaderboard);
    fetchKudos();
    fetchLeaderboard();
  }, []);

  const fetchKudos = async () => {
    try {
      const response = await getKudos();
      setKudos(response.data);
    } catch (error) {
      console.error("Error fetching kudos:", error);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await getKudosLeaderboard();
      console.log("Leaderboard Data:", response.data);
      setLeaderboard(response.data);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  // Memoized Filtering Logic (Optimized)
  const filteredKudos = useMemo(() => {
    return kudos.filter((k) => {
      const matchesCategory = selectedCategory ? k.category === selectedCategory : true;
      const matchesUser = selectedUser
        ? k.giver.name.toLowerCase().includes(selectedUser.toLowerCase()) ||
          k.receiver.name.toLowerCase().includes(selectedUser.toLowerCase())
        : true;
      const matchesDate = selectedDate
        ? format(new Date(k.timestamp), "yyyy-MM-dd") === selectedDate
        : true;
      return matchesCategory && matchesUser && matchesDate;
    });
  }, [kudos, selectedCategory, selectedUser, selectedDate]);

  const resetFilters = () => {
    setSelectedCategory("");
    setSelectedUser("");
    setSelectedDate("");
  };
 
    // Display only a limited number of kudos
    const visibleKudos = filteredKudos.slice(0, visibleCount);
  return (
    <div className="kudos-dashboard">
      <Navbar />
      <div className="dashboard-content">
        <h2 className="dashboard-title">Kudos Dashboard</h2>

        {/* 🏆 Kudos Leaderboard */}
        <div className="leaderboard-section">
          <h3 className="section-title">🏆 Kudos Leaderboard</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>User</th>
                <th>Kudos Received</th>
              </tr>
            </thead>
            
            <tbody>
  {leaderboard.length > 0 ? (
    leaderboard.map((entry) => (
      <tr key={entry.userId}>
        <td>
          {entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : entry.rank === 3 ? "🥉" : entry.rank}
        </td>
        <td>{entry.name}</td>
        <td>{entry.kudosCount}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={3} className="no-data">No data available</td>
    </tr>
  )}
</tbody>

          </table>
        </div>

        {/* 📌 Filters */}
        <div className="filter-section">
          <select className="filter-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <input type="text" className="filter-input" placeholder="Filter by user" value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} />

          <input type="date" className="filter-input" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />

          <button className="reset-btn" onClick={resetFilters}>Reset</button>
        </div>

        {/* 📜 Kudos Table */}
        <h3 className="section-title">Kudos History</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Giver</th>
              <th>Receiver</th>
              <th>Category</th>
              <th>Reason</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredKudos.length > 0 ? (
              filteredKudos.map((k) => (
                <tr key={k._id}>
                  <td>{k.giver.name}</td>
                  <td>{k.receiver.name}</td>
                  <td>{k.category}</td>
                  <td>{k.reason}</td>
                  <td>{format(new Date(k.timestamp), "yyyy-MM-dd")}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="no-data">No kudos found</td>
              </tr>
            )}
          </tbody>
        </table>
        {/* "Load More" Button */}
        {visibleKudos.length < filteredKudos.length && (
          <button className="load-more-btn" onClick={() => setVisibleCount(visibleCount + 10)}>
            Load More
          </button>
        )}
      </div>
    </div>
  );
};

export default KudosDashboard;
