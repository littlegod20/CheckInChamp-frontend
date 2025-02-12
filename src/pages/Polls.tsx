import { useEffect, useState } from "react";
// import { getPollDetails } from "../services/api";
import { fetchPolls, fetchTeams, PollTypes, PollVotes } from "@/store/store";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { Loader2 } from "lucide-react";
import { FormTypes } from "@/types/CardWithFormTypes";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { getPollDetails } from "@/services/api";
import PollCard from "@/components/PollCard";
import VotesPopup from "@/components/VotesPopup";

const PollsPage = () => {
  const [teamSearch, setTeamSearch] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [currentPageLocal, setCurrentPageLocal] = useState(1);
  const [allTeams, setAllTeams] = useState<Partial<FormTypes[]>>([]);
  const itemsPerPage = 5;

  const [selectedPoll, setSelectedPoll] = useState<PollTypes | null>(null);
  const [voters, setVoters] = useState<PollVotes[]>([]); // Store voters separately

  const dispatch = useAppDispatch();
  const { polls, loading } = useAppSelector((state) => state.app);



  const handlePollClick = async (poll: PollTypes) => {
    try {
      const response = await getPollDetails(poll._id);
      setSelectedPoll(response.data);
      setVoters(response.data.votes); // Store voters separately
    } catch (err) {
      console.error("Error fetching poll details:", err);
    }
  };

  const closePollDetails = () => {
    setSelectedPoll(null);
    setVoters([]);
  };

  // Update the useEffect for initial data fetch
  useEffect(() => {
    dispatch(
      fetchPolls({
        page: currentPageLocal,
        limit: itemsPerPage,
      })
    );

    dispatch(fetchTeams()).then((action) => {
      if (fetchTeams.fulfilled.match(action)) {
        setAllTeams(action.payload); // Remove the "All Teams" entry here
      }
    });
  }, [currentPageLocal, dispatch]);

  // Update handleSearch to handle empty team filter
  const handleSearch = () => {
    setCurrentPageLocal(1);
    dispatch(
      fetchPolls({
        page: 1,
        limit: itemsPerPage,
        teamName: teamSearch || undefined, // Send undefined if empty
        startDate,
        endDate,
      })
    );
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPageLocal(Math.max(1, Math.min(newPage, polls?.totalPages || 1)));
  };

  return (
    <div className=" p-6 text-black-primary">
      <Header title="All Polls" description="View all polls from teams here." />

      {/* Search filters */}
      <div className="flex gap-2 mb-4 items-end pt-4">
        {/* Team Filter */}
        <div className="w-64">
          <label
            htmlFor="team"
            className="block text-sm font-medium text-gray-700"
          >
            Team
          </label>
          <select
            id="team"
            value={teamSearch}
            onChange={(e) => setTeamSearch(e.target.value)}
            className="mt-1 block w-full p-2 border text-black border-gray-300 rounded-lg shadow-sm"
          >
            <option value="">All Teams</option>
            {allTeams.map((team) => (
              <option key={team?.name} value={team?.name}>
                {team?.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <div>
            <label
              htmlFor="team"
              className="block text-sm font-medium text-gray-700"
            >
              From
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 border p-2 rounded text-gray-900"
            />
          </div>

          <div>
            <label
              htmlFor="team"
              className="mt-1 block text-sm font-medium text-gray-700"
            >
              To
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border p-2 rounded text-gray-900"
            />
          </div>
        </div>
        <Button
          className="bg-green-primary hover:bg-green-secondary px-6 py-4"
          onClick={handleSearch}
        >
          Search
        </Button>
      </div>

      <VotesPopup
        selectedPoll={selectedPoll}
        voters={voters}
        closePollDetails={closePollDetails}
      />

      <div className="flex flex-wrap items-center gap-4 pt-6">
        {loading.polls === "pending" ? (
          <div className="flex-1 flex justify-center items-center h-[250px]">
            <Loader2 className="animate-spin text-green-primary" size={40} />
          </div>
        ) : polls && polls?.polls.length > 0 ? (
          polls?.polls.map((poll) => (
            <PollCard
              id={poll._id}
              poll={poll}
              handlePollClick={handlePollClick}
            />
          ))
        ) : (
          <p className="text-center text-gray-900">No polls available.</p>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center pt-6 text-white">
        <button
          onClick={() => handlePageChange(currentPageLocal - 1)}
          disabled={currentPageLocal === 1}
          className="bg-green-primary px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span className="text-gray-700">
          Page {currentPageLocal} of {polls?.totalPages}
        </span>

        <button
          onClick={() => handlePageChange(currentPageLocal + 1)}
          disabled={currentPageLocal === polls?.totalPages}
          className="bg-green-primary px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PollsPage;
