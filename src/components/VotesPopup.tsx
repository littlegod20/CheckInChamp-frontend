import { PollTypes, PollVotes } from "@/store/store";
import { useMemberResolver } from "@/utils/helpers";

const VotesPopup = ({
  selectedPoll,
  voters,
  closePollDetails,
}: {
  selectedPoll: PollTypes | null;
  voters: PollVotes[];
  closePollDetails: () => void;
}) => {

  console.log("voters:", voters)
  const { resolveMemberName } = useMemberResolver();

  return (
    <>
      {selectedPoll && (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex justify-center items-center p-4 z-50 ">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border-2 border-green-primary overflow-y-scroll max-h-[600px]">
            {/* Modal Header */}
            <div className="bg-green-primary p-4 ">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                {selectedPoll.question}
              </h2>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Options */}
              <div>
                <h3 className="text-sm font-semibold text-green-primary uppercase tracking-wide mb-3">
                  Poll Options
                </h3>
                <ul className="space-y-2">
                  {selectedPoll.options.map((option, index) => (
                    <li
                      key={index}
                      className="flex items-center bg-green-secondary/20 p-3 rounded-lg"
                    >
                      <span className="w-5 h-5 bg-green-primary text-white flex items-center justify-center rounded-full mr-3">
                        {index + 1}
                      </span>
                      <span className="text-gray-800">{option}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-green-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <p className="text-sm text-gray-600">
                    Created by:{" "}
                    <span className="font-medium capitalize">
                      {resolveMemberName(selectedPoll.createdBy) || "Unknown"}
                    </span>
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-green-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-sm text-gray-600">
                    {new Date(selectedPoll.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>

              {/* Voters */}
              <div>
                <h3 className="text-sm font-semibold text-green-primary uppercase tracking-wide mb-3">
                  Voting Activity ({voters.length})
                </h3>
                {voters.length > 0 ? (
                  <div className="space-y-3">
                    {voters.map((vote, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-primary/10 text-green-primary rounded-full flex items-center justify-center">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                            </svg>
                          </div>
                          <span className="font-medium text-gray-800">
                            {vote.username}
                          </span>
                        </div>
                        <span className="text-sm bg-green-primary/10 text-green-primary px-3 py-1 rounded-full">
                          Voted for: {vote.selectedOptions}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No votes recorded yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Close Button */}
            <div className="border-t p-4 flex justify-end">
              <button
                onClick={closePollDetails}
                className="px-4 py-2 text-sm font-medium text-green-primary hover:bg-green-primary/10 rounded-lg transition-colors duration-200"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VotesPopup;
