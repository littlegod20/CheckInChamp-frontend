import { ClassNameValue } from "tailwind-merge";


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
  id?: string;
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
  slackChannelId?: string;
  _id?: string;
  id?: string;
  name: string;
  members: string[];
  timezone: string;
  standUpConfig: StandUpConfigTypes;
}
