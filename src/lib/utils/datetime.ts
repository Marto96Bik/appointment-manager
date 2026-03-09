export function formatDateTime(dateInput: string | Date) {
  const date = new Date(dateInput);

  const formattedDate = date.toLocaleDateString("es-IL", {
    timeZone: "Asia/Jerusalem",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const formattedTime = date.toLocaleTimeString("es-IL", {
    timeZone: "Asia/Jerusalem",
    hour: "2-digit",
    minute: "2-digit",
  });

  return { formattedDate, formattedTime };
}
