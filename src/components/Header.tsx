import { HeaderTypes } from "../types/HeaderTypes";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header: React.FC<HeaderTypes> = ({
  title,
  description,
  Button,
  back = false,
}) => {
  const navigate = useNavigate();
  return (
    <div className="border-slate-200 border-b-2 pb-8  w-full flex sm:justify-between sm:flex-row flex-col items-center gap-4">
      <div className="flex items-center gap-2 w-[80%]">
        {back ? (
          <ArrowLeft
            className="text-slate-500 cursor-pointer"
            onClick={() => navigate(-1)}
          />
        ) : null}
        <header className="">
          <h4 className="text-dark-blue font-medium">{title.toUpperCase()}</h4>
          <p className="font-medium text-xs sm:text-sm text-slate-500">
            {description}
          </p>
        </header>
      </div>
      <div className="pt-4 sm:pt-0 flex justify-end">{Button}</div>
    </div>
  );
};

export default Header;
