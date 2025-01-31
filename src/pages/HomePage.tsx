import { Laugh } from "lucide-react";
import React from "react";
import Header from "../components/Header";

const mood = [
  {
    teamName: "Team Checker",
    mood: Laugh,
  },
];

const HomePage: React.FC = () => {
  return (
    <div className="">
      {/* <h1>Welcome to the Check In Champ Bot App</h1>
      <p className="text-sm">Streamline your team's daily standups and reporting with ease.</p> */}
      {/* <div className="home-links">
        <Link to="/teams" className="card">
          <div className="card-icon">
            <FontAwesomeIcon icon={faUsers} />
          </div>
          <div className="card-title">Create/Manage Teams</div>
        </Link>
        
        <Link to="/teams/:teamId/members/:memberId/standup" className="card">
          <div className="card-icon">
            <FontAwesomeIcon icon={faClipboard} />
          </div>
          <div className="card-title">View Standups</div>
        </Link>
        <Link to="/reports" className="card">
          <div className="card-icon">
            <FontAwesomeIcon icon={faChartBar} />
          </div>
          <div className="card-title">Generate Reports</div>
        </Link>
      </div> */}

      <section>
        <Header
          title="Welcome to Check In Champ"
          description="Streamline your team's daily standups and reporting with ease."
          Button={<button>Create Team</button>}
        />
      </section>

      <section className="bg-black-secondary max-w-[500px] flex p-2 justify-center rounded-xl">
        <div>
          <p>Mood For Teams</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
