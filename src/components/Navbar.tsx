import React, { useEffect, useState } from "react";
import TabBar from "./TabBar";
import { tabs } from "../utils/constants";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const [activeTab, setActiveTab] = useState("home");
  const navigate = useNavigate();

  const handleNavBar = (val: string) => {
    setActiveTab(val);
    localStorage.setItem("navTab", val);

    if (val === "home") {
      navigate("/");
      return;
    }
    //  navigate(`${val}`);
  };

  useEffect(() => {
    const active = localStorage.getItem("navTab");
    if (active) {
      setActiveTab(active);
    }

    return () => {
      localStorage.removeItem("navTab");
    };
  }, []);

  return (
    <nav className="bg-black-primary md:min-w-[300px] rounded-r-3xl px-4 space-y-4 text-sm">
      <section className="flex items-center justify-start p-3 gap-2">
        <img src="/checkInBot.png" alt="icon" className="w-10 rounded-lg" />
        <p className="font-bold text-md">CheckIn</p>
      </section>

      <section className="flex flex-col bg-black-secondary px-2 py-4 gap-3 rounded-xl justify-center items-center min-w-[200px]">
        {tabs.map((item, index) => (
          <TabBar
            name={item.name}
            Icon={item.Icon}
            isActive={activeTab}
            onNavigation={handleNavBar}
            key={index}
          />
        ))}
      </section>
    </nav>
  );
};

export default Navbar;
