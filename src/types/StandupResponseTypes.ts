export interface StandupResponseTypes {
  standups: StandUps[];
  statuses: StatusTypes[];
}

export interface StandUps {
  _id: string;
  teamName: string;
  userId: string;
  slackChannelId: string;
  messageTs: string;
  date: Date;
  responses: ResponsesTypes[];
}

export interface StatusTypes {
  _id: string;
  date: string;
  participationRate: string;
  questions: Question[];
  slackChannelId: string;
  teamName: string;
  status: SingleStatus[];
  error?: string;
}

export interface SingleStatus {
  userId: string;
  status: string;
}

export interface Question {
  id: string;
  options?: string[];
  required: boolean;
  text: string;
  type: string;
}

export interface StandUpConfigTypes {
  questions: {
    id: string;
    options?: string[];
    required: boolean;
    text: string;
    type: string;
  }[];
  reminderTimes: string[];
  standUpTimes: string[];
  standUpDays: string[];
}

interface ResponsesTypes {
  userId: string;
  answers: {
    answer: string;
    questionId: string;
  }[];
  responseTime: Date;
}
