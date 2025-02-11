import { useParams } from "react-router-dom";
import { useAppSelector } from "@/hooks/hooks";
import { StandUps, StatusTypes } from "@/types/StandupResponseTypes";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { saveAs } from "file-saver";

const StandupDetailsPage = () => {
  const { id } = useParams<{ id: string }>(); // Get the standup ID from the URL
  const { standups, members } = useAppSelector((state) => state.app);

  // Find the standup by ID
  const standup = standups
    ? standups.standups.find((standup: StandUps) => standup._id === id)
    : null;

  const status = standups
    ? standups.statuses.find((stat: StatusTypes) => stat._id[0] === id)
    : null;

  const findMemberName = (member: string) => {
    return members.find((item) => item.id === member)?.name || null;
  };

  if (!standup) {
    return <div>Standup not found.</div>;
  }

  const exportToCSV = () => {
    if (!standup || !status) return;

    // Create CSV content
    const csvHeaders = [
      "User",
      "Response Time",
      ...status.questions.map((q, i) => `Q${i + 1}: ${q.text}`),
      "Status",
    ];

    const csvRows = standup.responses.map((response) => {
      const answers = response.answers.map((a) =>
        Array.isArray(a.answer) ? a.answer.join(", ") : a.answer
      );

      return [
        findMemberName(response.userId),
        new Date(response.responseTime).toLocaleString(),
        ...answers,
        "Responded",
      ];
    });

    // Add missed members
    const missedRows = status.status
      .filter((s) => s.status === "missed")
      .map((s) => [
        findMemberName(s.userId),
        "N/A",
        ...Array(status.questions.length).fill("N/A"),
        "Missed",
      ]);

    const csvContent = [csvHeaders, ...csvRows, ...missedRows]
      .map((row) => row.join(","))
      .join("\n");

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `standup-${standup.teamName}-${standup.date}.csv`);
  };

  const exportToJSON = () => {
    if (!standup || !status) return;

    const exportData = {
      metadata: {
        team: standup.teamName,
        date: standup.date,
        participationRate: status.participationRate,
      },
      questions: status.questions,
      responses: standup.responses.map((response) => ({
        user: findMemberName(response.userId),
        responseTime: response.responseTime,
        answers: response.answers.map((a) => ({
          question: status.questions[Number(a.questionId)].text,
          answer: a.answer,
        })),
      })),
      participants: status.status.map((s) => ({
        user: findMemberName(s.userId),
        status: s.status,
      })),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    saveAs(blob, `standup-${standup.teamName}-${standup.date}.json`);
  };

  console.log(
    "standup:",
    new Date(standup.date).setHours(0, 0, 0, 0) <=
      new Date().setHours(0, 0, 0, 0)
  );
  console.log("standup date:", new Date(standup.date).setHours(0, 0, 0, 0));
  console.log("today date:", new Date().setHours(0, 0, 0, 0));

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-black-secondary">
      <Header
        title="Standup Details"
        description="View and export standup details"
        Button={
          <div className="flex gap-2">
            <Button
              className="bg-green-primary hover:bg-green-secondary"
              onClick={exportToCSV}
            >
              Export as CSV
            </Button>
            <Button
              className="bg-black-primary hover:bg-black-secondary"
              onClick={exportToJSON}
            >
              Export as JSON
            </Button>
          </div>
        }
      />

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">{standup?.teamName}</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Date:</p>
            <p className="text-gray-900">
              {new Date(standup.date).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Time:</p>
            <p className="text-gray-900">
              {new Date(standup.date).toLocaleTimeString()}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Participants:</p>
            <p className="text-gray-900">
              {standup.responses.length}/{status?.status.length} (
              {status?.participationRate})
            </p>
          </div>
          <div>
            <p className="text-gray-600">Status:</p>
            <p
              className={`px-2 py-1 text-xs font-semibold rounded-full w-24 flex justify-center items-center ${
                new Date(standup.date).setHours(0, 0, 0, 0) <
                new Date().setHours(0, 0, 0, 0)
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {new Date(standup.date).setHours(0, 0, 0, 0) <
              new Date().setHours(0, 0, 0, 0)
                ? "Completed"
                : "Pending"}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mt-6 mb-4">Questions</h3>
          <div>
            {status &&
              status.questions.map((item, index) => (
                <p key={index}>
                  <strong>Q{index + 1}: </strong> {item.text}
                </p>
              ))}
          </div>
        </div>

        <h3 className="text-lg font-semibold mt-6 mb-4">Responses</h3>
        <div className="space-y-4 flex gap-4 flex-wrap">
          {standup.responses.map((response, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600">
                User:{" "}
                <span className="capitalize font-bold">
                  {findMemberName(response.userId)}
                </span>
              </p>
              <p className="text-gray-600">
                Response Time:{" "}
                {new Date(response.responseTime).toLocaleString()}
              </p>
              <div className="mt-2">
                {response.answers.map((answer, idx) => (
                  <div key={idx} className="text-gray-900">
                    <p>
                      <strong>Q{idx + 1}:</strong>{" "}
                      {answer.answer || "No response"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="w-full flex items-start pt-4 border-t-2">
          <div className="w-1/2">
            <p className="font-bold text-red-600">Missed</p>
            {status?.status
              .filter((item) => item.status !== "responded")
              .map((item, index) => (
                <p className="capitalize" key={index}>
                  {findMemberName(item.userId)}
                </p>
              ))}
          </div>
          <div className="w-1/2 ">
            <p className="font-bold text-green-primary">Responded</p>
            {status?.status
              .filter((item) => item.status === "responded")
              .map((item, index) => (
                <p className="capitalize" key={index}>
                  {findMemberName(item.userId)}
                </p>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StandupDetailsPage;
