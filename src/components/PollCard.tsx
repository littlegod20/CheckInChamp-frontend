import { PollTypes } from "@/store/store";
import { useMemberResolver } from "@/utils/helpers";

const PollCard = ({
  id,
  handlePollClick,
  poll,
}: {
  id: string;
  handlePollClick: (val: PollTypes) => void;
  poll: PollTypes;
}) => {
  const { resolveMemberName } = useMemberResolver();

  return (
    <>
      <div
        key={id}
        className="p-6 border-2 border-green-primary rounded-xl shadow-lg bg-white cursor-pointer hover:bg-[#C6F6D5] transition-colors duration-300 group w-64 flex flex-col justify-between"
        onClick={() => handlePollClick(poll)}
      >
        {/* Card Content */}
        <div className="space-y-4">
          {/* Question */}
          <div className="mb-4">
            <div className="flex items-center gap-2 text-green-primary">
              <svg
                className="w-5 h-5"
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
              <h2 className="text-lg font-bold truncate">{poll.question}</h2>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3 text-sm">
            {/* Team */}
            <div className="flex items-center gap-2 text-gray-700">
              <svg
                className="w-4 h-4 text-green-primary"
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
              <span className="truncate">
                {poll.teamName || "Unknown Team"}
              </span>
            </div>

            {/* Created By */}
            <div className="flex items-center gap-2 text-gray-700">
              <svg
                className="w-4 h-4 text-green-primary"
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
              <span className="truncate">
                {resolveMemberName(poll.createdBy)}
              </span>
            </div>

            {/* Date */}
            <div className="flex items-center gap-2 text-gray-700">
              <svg
                className="w-4 h-4 text-green-primary"
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
              <span>
                {new Date(poll.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="mt-4">
          <div className="h-1 bg-green-primary/20 rounded-full">
            <div
              className="h-1 bg-green-primary rounded-full transition-all duration-500"
              style={{ width: `${(poll.votes.length / 20) * 100}%` }} // Adjust based on your max votes
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default PollCard;
