import axios from 'axios';


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

// Set up base URL for your backend API
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const createTeam = async (teamData: { name: string; description: string;  }) => {
  return api.post('/teams', teamData);
};

export const addMember = async (teamId: string, memberData: Member[] ) => {
  return api.post(`/members/${teamId}`, {"members": memberData});
};

//configure standup questions 
export const configureStandupQuestions = async (teamId: string, questions: Question[] ) => {
  return api.post(`/standups/team/${teamId}/configure`, { questions });
};

//get standup questions
export const getStandupQuestions = async (teamId: string) => {
  return api.get(`/standups/team/${teamId}/questions`);
};

export const submitStandup = async (teamId: string, memberId: string, answers:Answer[]) => {
  return api.post(`/standups/team/${teamId}/members/${memberId}/standup`, { "update":answers });
};

export const getStandups = async (filters: { teamId?: string; memberId?: string; date?: string }) => {
  return api.get('/standups', { params: filters });
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
  return await api.get('/teams/questions');
};

//get teams only
export const getTeamsOnly = async () => {
  return await api.get('/teams');
};

export const deleteTeam = async (teamId: string) => {
  return await api.delete(`/teams/${teamId}`);
};

export const removeMember = async ( teamId: string, memberId: string) => {
  return await api.delete(`members/${teamId}/${memberId}`);
};

//function to get all members
export const getMembers = async () => {
  return await api.get(`/members/`);
};

//function to set team reminders
// Function to set team reminders
export const setTeamReminders = async (reminders: { channel: string; text: string; scheduleTime: string }) => {
  return await api.post(`/teams/team-reminder`, reminders);
};
