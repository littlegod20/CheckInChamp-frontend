import { TabBarTypes } from "../types/TabBar";

const TabBar: React.FC<TabBarTypes> = ({ Icon, name, isActive }) => {
  return (
    <div
      className={`flex p-1 gap-2 items-center duration-300 ease-in hover:bg-[#1d6d55] rounded-full w-4/5 ${
        isActive ? "bg-[#1d6d55] font-bold" : ""
      }`}
    >
      {Icon && (
        <div className={`rounded-full p-2 ${isActive ? "bg-[#191919]" : ""}`}>
          <Icon />
        </div>
      )}
      <p>{name}</p>
    </div>
  );
};

export default TabBar;
