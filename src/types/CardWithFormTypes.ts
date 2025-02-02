import { LucideIcon } from "lucide-react";
import { ClassNameValue } from "tailwind-merge";

export interface MoreOptions {
  label: string;
  path?: string;
  action?: () => void | ((val: number) => void);
  Icon?: LucideIcon;
}

export interface CardWithFormTypes {
  title?: string;
  description?: string;
  className?: ClassNameValue;
  buttonLayout?: string;
  outClick?: boolean;
  onCancel?: () => void;
  submitForm?: (e: React.FormEvent<HTMLFormElement>) => void;
}

export interface Questions {
  id?: number;
  text: string;
  type: string;
  options: string[];
}

export interface StandUpConfigTypes {
  questions: Questions[];
  reminderTimes: string[];
  standUpDays: string[];
  standUpTimes: string[];
}

export interface FormTypes {
  name: string;
  members: string[];
  timezone: string;
  standUpConfig: StandUpConfigTypes;
}
