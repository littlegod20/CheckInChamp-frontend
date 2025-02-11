export interface MoodEntry {
  userId: string;
  date: string;
  teamName: string;
  userName: string;
  mood: "happy" | "neutral" | "sad";
}
