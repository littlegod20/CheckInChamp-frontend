import { FormTypes } from "@/types/CardWithFormTypes";
import axios from "axios";

interface Member {
  id: string;
  name: string;
}

interface Question {
  id: number;
  text: string;
  answer: string;
}

interface Answer {
  question: string;
  answer: string;
}
interface KudosData {
  giverId: string;
  receiverId: string;
  category: string;
  reason: string;
}

// Set up base URL for your backend API
export const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const createTeam = async (teamData: FormTypes) => {
  return api.post("/teams", teamData);
};

export const addMember = async (teamId: string, memberData: Member[]) => {
  return api.post(`/members/${teamId}`, { members: memberData });
};

//configure standup questions
export const configureStandupQuestions = async (
  teamId: string,
  questions: Question[]
) => {
  return api.post(`/standups/team/${teamId}/configure`, { questions });
};

//get standup questions
export const getStandupQuestions = async (teamId: string) => {
  return api.get(`/standups/team/${teamId}/questions`);
};

export const submitStandup = async (
  teamId: string,
  memberId: string,
  answers: Answer[]
) => {
  return api.post(`/standups/team/${teamId}/members/${memberId}/standup`, {
    update: answers,
  });
};

export const getStandups = async (filters: {
  teamId?: string;
  memberId?: string;
  date?: string;
}) => {
  return api.get("/standups", { params: filters });
};

export const getTeamStandups = async (teamId: string) => {
  return api.get(`/standups/teams/${teamId}`);
};

//get those who responded
export const getStandupResponses = async () => {
  return api.get(`/standups/answers`);
};

// get those who did not respond
export const getStandupNotResponded = async (standupId: string) => {
  return await api.get(`/standups/${standupId}/not-responded`);
};

export const getTeams = async () => {
  return await api.get("/teams/questions");
};

//get teams only
export const getTeamsOnly = async () => {
  return await api.get("/teams");
};

export const deleteTeam = async (teamId: string) => {
  return await api.delete(`/teams/${teamId}`);
};

export const removeMember = async (teamId: string, memberId: string) => {
  return await api.delete(`members/${teamId}/${memberId}`);
};

//function to get all members
export const getMembers = async () => {
  return await api.get(`members/`);
};

//function to set team reminders
// Function to set team reminders
export const setTeamReminders = async (reminders: {
  channel: string;
  text: string;
  scheduleTime: string;
}) => {
  return await api.post(`/teams/team-reminder`, reminders);
};

// Fetch all kudos with optional filters (teamMember, category, date range)
export const getKudos = async (filters?: { teamMember?: string; category?: string; startDate?: string; endDate?: string }) => {
  return api.get("/kudos", { params: filters });
};

// Get kudos received by a specific user
export const getReceivedKudos = async (userId: string) => {
  return api.get(`/kudos/received/${userId}`);
};

// Get kudos given by a specific user
export const getGivenKudos = async (userId: string) => {
  return api.get(`/kudos/given/${userId}`);
};

// Get kudos leaderboard (users with most kudos)
export const getKudosLeaderboard = async () => {
  return api.get("/kudos/leaderboard");
};

// Get kudos statistics (e.g., total given/received per user)
export const getKudosStats = async () => {
  return api.get("/kudos/stats");
};

// Get kudos trends over time (e.g., kudos given per day)
export const getKudosTrends = async () => {
  return api.get("/kudos/trends");
};

// Fetch all polls
// Fetch all polls with optional team filter
export const getPolls = async (teamName?: string) => {
  return api.get("/polls", { params: teamName ? { teamName } : {} });
};

// Fetch poll details by pollId
export const getPollDetails = async (pollId: string) => {
  return api.get(`/polls/${pollId}/details`);
};

