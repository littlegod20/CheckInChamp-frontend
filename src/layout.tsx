import Navbar from "./components/Navbar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <main className="flex w-screen bg-[#0B0B0B] h-screen text-white">
      <Navbar />
      <section className="flex-1 h-screen overflow-y-scroll">
        <Outlet />
      </section>
    </main>
  );
};

export default MainLayout;
