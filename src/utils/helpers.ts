import { FormTypes } from "@/types/CardWithFormTypes";
import { StatusTypes } from "@/types/StandupResponseTypes";

export function convertTo12Hour(time24: string) {
  // Split hours and minutes
  const [hours, minutes] = time24.split(":");

  // Convert hours to number
  let hour = parseInt(hours);

  // Determine period (AM/PM)
  const period = hour >= 12 ? "PM" : "AM";

  // Convert hour to 12-hour format
  hour = hour % 12;
  hour = hour === 0 ? 12 : hour;

  // Pad single digit hours with leading zero
  const formattedHour = hour < 10 ? `0${hour}` : hour;

  console.log(formattedHour);

  // Return formatted time
  return `${formattedHour}:${minutes} ${period}`;
}

export const calculateOverallParticipationRate = (
  standups: Array<StatusTypes>
) => {
  // Filter out invalid standup objects (those with an error)
  const validStandups = standups.filter(
    (item) => !item.error && item.participationRate
  );

  // Extract and convert participation rates to numbers
  const participationRates = validStandups.map((item) =>
    parseFloat(item.participationRate.replace("%", ""))
  );

  // Calculate the average participation rate
  const overallRate =
    participationRates.length > 0
      ? participationRates.reduce((sum, rate) => sum + rate, 0) /
        participationRates.length
      : 0; // Avoid division by zero

  return overallRate.toFixed(2) + "%"; // Return as percentage string
};

export const getPendingRemindersCount = (teams: Array<FormTypes>) => {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" }); // e.g., "Monday"
  const currentTime = new Date();

  // Filter teams that have a standup scheduled for today
  const teamsWithTodayStandup = teams.filter((team) =>
    team.standUpConfig?.standUpDays?.includes(today)
  );

  // Extract and flatten reminder times from all matching teams
  const allReminderTimes = teamsWithTodayStandup.flatMap(
    (team) => team.standUpConfig.reminderTimes || []
  );

  // Convert reminder times to Date objects and filter pending ones
  const pendingReminders = allReminderTimes.filter((time) => {
    const [hours, minutes] = time.split(/[: ]/); // Split "HH:MM AM/PM"
    const isPM = time.includes("PM");

    const reminderDate = new Date();
    reminderDate.setHours(isPM ? (parseInt(hours) % 12) + 12 : parseInt(hours)); // Convert to 24-hour format
    reminderDate.setMinutes(parseInt(minutes));
    reminderDate.setSeconds(0);

    return reminderDate > currentTime; // Check if reminder is still pending
  });

  return pendingReminders.length;
};
