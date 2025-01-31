import React from "react";
import TabBar from "./TabBar";
import { tabs } from "../utils/constants";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-[#191919] md:min-w-[300px] rounded-r-3xl px-4 space-y-4 text-sm">
      <section className="flex items-center justify-start p-3 gap-2">
        <img src="/checkInBot.png" alt="icon" className="w-10 rounded-lg" />
        <p className="font-bold text-md">CheckIn</p>
      </section>

      <section className="flex flex-col bg-[#292828] px-2 py-4 gap-3 rounded-xl justify-center items-center min-w-[200px]">
        {tabs.map((item) => (
          <TabBar name={item.name} Icon={item.Icon} isActive={item.isActive} />
        ))}
      </section>
    </nav>
  );
};

export default Navbar;
