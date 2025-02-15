import { Tooltip } from "react-tooltip";
import { TabBarTypes } from "../types/TabBar";

const TabBar: React.FC<TabBarTypes> = ({
  Icon,
  name,
  isActive,
  onNavigation,
}) => {
  return (
    <div
      className={`flex p-1 gap-2 items-center justify-center md:justify-start duration-300 ease-in hover:bg-green-primary rounded-full w-4/5 cursor-pointer ${
        isActive === name.toLowerCase() ? "bg-green-primary font-bold" : ""
      }`}
      onClick={() => onNavigation(name.toLowerCase())}
      data-tooltip-content={name}
      data-tooltip-id="my-tooltip"
    >
      {Icon && (
        <div
          className={`rounded-full p-2 ${isActive ? "bg-black-primary" : ""}`}
        >
          <Icon />
        </div>
      )}
      <p className="hidden md:block">{name}</p>
      <Tooltip id="my-tooltip" className="md:hidden" />
    </div>
  );
};

export default TabBar;
