import { useEffect, useState, useMemo } from "react";
import { format } from "date-fns";
import "../styles/KudosDashboard.css";
import Header from "@/components/Header";
import { fetchKudos } from "@/store/store";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import Pagination from "@/components/Pagination";
import { getKudosLeaderboard } from "@/services/api";

interface LeaderboardEntry {
  userId: string;
  name: string;
  kudosCount: number;
}

const KudosDashboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");

  const [limit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 1,
  });

  const categories = ["teamwork", "creativity", "leadership"];

  const dispatch = useAppDispatch();
  const { kudos } = useAppSelector((state) => state.app);

  useEffect(() => {
    dispatch(fetchKudos({ page: currentPage, limit }))
      .unwrap()
      .then((data) => {
        setPagination(data.pagination);
      });
  }, [dispatch, currentPage, limit]);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  useEffect(() => {
    console.log("kudos data:", kudos);
    console.log("pagination:", pagination);
  }, [kudos, pagination]);

  const fetchLeaderboard = async () => {
    try {
      const response = await getKudosLeaderboard();
      setLeaderboard(response.data);
      console.log("leaderboard:", response.data);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  // Memoized Filtering Logic (Optimized)
  const filteredKudos = useMemo(() => {
    return kudos.kudos.filter((k) => {
      const matchesCategory = selectedCategory
        ? k.category === selectedCategory
        : true;
      const matchesUser = selectedUser ? k.giverId || k.receiverId : true;
      const matchesDate = selectedDate
        ? format(new Date(k.timestamp), "yyyy-MM-dd") === selectedDate
        : true;
      return matchesCategory && matchesUser && matchesDate;
    });
  }, [kudos.kudos, selectedCategory, selectedUser, selectedDate]);

  const resetFilters = () => {
    setSelectedCategory("");
    setSelectedUser("");
    setSelectedDate("");
  };

  return (
    <div className="flex text-black-primary w-full flex-col p-6 ">
      {/* <div className="bg-white "> */}
      <Header title="Kudos Dashboard" description="View all kudos given here" />

      {/* 🏆 Kudos Leaderboard */}
      <div className="leaderboard-section pt-5">
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
              leaderboard.map((entry, index) => (
                <tr key={entry.userId}>
                  <td>
                    {index === 0
                      ? "🥇"
                      : index === 1
                      ? "🥈"
                      : index === 2
                      ? "🥉"
                      : index + 1}
                  </td>
                  <td>{entry.userId}</td>
                  <td>{entry.kudosCount}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="no-data">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 📌 Filters */}
      <div className="flex flex-wrap gap-2 pb-5">
        <select
          className="filter-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input
          type="text"
          className="filter-input"
          placeholder="Filter by user"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        />

        <input
          type="date"
          className="filter-input"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />

        <button className="reset-btn" onClick={resetFilters}>
          Reset
        </button>
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
                <td>{k.giverId}</td>
                <td>{k.receiverId}</td>
                <td>{k.category}</td>
                <td>{k.reason}</td>
                <td>{format(new Date(k.timestamp), "yyyy-MM-dd")}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="no-data">
                No kudos found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <Pagination
        currentPage={currentPage}
        total={pagination.total}
        onCurrentPage={setCurrentPage}
        page={pagination.page}
        totalPages={pagination.totalPages}
      />
    </div>
  );
};

export default KudosDashboard;
