import { useEffect, useState } from "react";
import { getPolls, getPollDetails } from "../services/api"; // Import API functions

interface Poll {
  _id: string;
  question: string;
  options: string[];
  createdBy: string;
  createdByName?: string;
  anonymous: boolean;
  channelId: string;
  teamName?: string;
}

interface Vote {
  userId: string;
  username: string;
  selectedOptions: string[];
}

const PollsPage = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [filteredPolls, setFilteredPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [teamSearch, setTeamSearch] = useState<string>("");
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);
  const [voters, setVoters] = useState<Vote[]>([]); // Store voters separately
  const [detailsLoading, setDetailsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await getPolls();
        console.log(response.data);
        setPolls(response.data);
        setFilteredPolls(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, []);

  const handleSearch = () => {
    setFilteredPolls(
      !teamSearch.trim()
        ? polls
        : polls.filter((poll) => poll.teamName?.toLowerCase().includes(teamSearch.toLowerCase()))
    );
  };

  const handlePollClick = async (poll: Poll) => {
    setDetailsLoading(true);
    try {
      const response = await getPollDetails(poll._id);
      setSelectedPoll(response.data);
      setVoters(response.data.votes); // Store voters separately
    } catch (err) {
      console.error("Error fetching poll details:", err);
    } finally {
      setDetailsLoading(false);
    }
  };

  const closePollDetails = () => {
    setSelectedPoll(null);
    setVoters([]);
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
    <h1 className="text-2xl font-bold text-center mb-6 text-gray-900">All Polls</h1>
  
    <div className="flex gap-2 mb-4">
      <input
        type="text"
        placeholder="Search by team..."
        value={teamSearch}
        onChange={(e) => setTeamSearch(e.target.value)}
        className="border p-2 rounded flex-1 text-gray-900"
      />
      <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded">
        Search
      </button>
    </div>
  
    {selectedPoll && (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          {detailsLoading ? (
            <p className="text-center text-gray-900">Loading poll details...</p>
          ) : (
            <>
              <h2 className="text-lg font-semibold text-gray-900">{selectedPoll.question}</h2>
              <ul className="mt-2">
                {selectedPoll.options.map((option, index) => (
                  <li key={index} className="text-gray-900">- {option}</li>
                ))}
              </ul>
  
              <p className="text-sm text-gray-800 mt-2">
                Created by: <strong>{selectedPoll.createdByName || "Unknown"}</strong>
              </p>
  
              <h3 className="text-md font-semibold mt-4 text-gray-900">Voters:</h3>
{voters.length > 0 ? (
  <ul className="mt-2">
    {voters.map((vote, index) => (
      <li key={index} className="text-gray-900">
        <strong>{vote.username}</strong> voted for: {vote.selectedOptions}
      </li>
    ))}
  </ul>
) : (
  <p className="text-gray-700">No votes yet.</p>
)}

  
              <button onClick={closePollDetails} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
                Close
              </button>
            </>
          )}
        </div>
      </div>
    )}
  
    <div className="space-y-4">
      {filteredPolls.length > 0 ? (
        filteredPolls.map((poll) => (
          <div
            key={poll._id}
            className="p-4 border rounded-lg shadow-md bg-white cursor-pointer hover:bg-gray-100"
            onClick={() => handlePollClick(poll)}
          >
            <h2 className="text-lg font-semibold text-gray-900">{poll.question}</h2>
            <p className="text-sm text-gray-800 mt-2">Team: {poll.teamName || "Unknown"}</p>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-900">No polls available.</p>
      )}
    </div>
  </div>
  );
};  

export default PollsPage;
