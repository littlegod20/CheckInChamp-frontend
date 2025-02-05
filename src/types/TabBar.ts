import { LucideIcon } from "lucide-react";

export interface TabBarTypes {
  Icon?: LucideIcon;
  name: string;
  isActive?: string;
  onNavigation:(val:string)=>void
}
