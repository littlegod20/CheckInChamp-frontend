export interface AnalyticsDataTypes {
  standups: {
    completed: number;
    pending: number;
    avgParticipants: number;
    trends: {
      _id: string;
      completedStandups: number;
      date: string;
      standupCount: number;
      moodDistribution: {
        happy: number;
        neutral: number;
        sad: number;
      };
    }[];
  };
  moods: {
    happy: number;
    neutral: number;
    sad: number;
    avgMood: number;
    trends: number[];
  };
  kudos: {
    given: number;
    topReceiver: { _id: string; count: 2 }[];
    topCategory: { _id: string; count: 2 }[];
    trends?: {
      _id:string;
      count:number
    }[];
  };
  polls: {
    total: { total: number }[];
    avgParticipation: { avg: number }[];
    mostPopular: { _id: string; count: number }[];
  };
  teamComparison?: { team: string; kudos: number; polls: number }[];
  recentActivities: {
    type: string;
    teamId: string;
    date: string;
    details: string;
  }[];
}