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

  console.log(formattedHour)

  // Return formatted time
  return `${formattedHour}:${minutes} ${period}`;
}
