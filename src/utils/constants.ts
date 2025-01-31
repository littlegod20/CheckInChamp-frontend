import { TabBarTypes } from "../types/TabBar";
import { Calendar1, ChartPie, Home } from "lucide-react";

export const tabs: TabBarTypes[] = [
  {
    name: "Home",
    Icon: Home,
    isActive: true,
  },
  {
    name: "Schedule",
    Icon: Calendar1,
    isActive: false,
  },
  {
    name: "Analytics",
    Icon: ChartPie,
    isActive: false,
  },
];
