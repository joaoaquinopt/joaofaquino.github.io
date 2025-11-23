// src/lib/dateUtils.ts

export const formatActivityDayMonth = (value?: string) => {
  if (!value) return "--/--";

  // só a parte da data (corta horas, se houver)
  const [datePart] = value.split(" ");

  let year: number;
  let month: number;
  let day: number;

  if (datePart.includes("/")) {
    // "13/11/2025"
    const [d, m, y] = datePart.split("/");
    day = parseInt(d, 10);
    month = parseInt(m, 10);
    year = parseInt(y, 10);
  } else if (datePart.includes("-")) {
    // "2025-11-13" ou "2025-11-13T..."
    const [y, m, d] = datePart.split("T")[0].split("-");
    year = parseInt(y, 10);
    month = parseInt(m, 10);
    day = parseInt(d, 10);
  } else {
    // formato desconhecido → devolve como veio
    return datePart;
  }

  if (!year || !month || !day) return datePart;

  const dd = day.toString().padStart(2, "0");
  const mm = month.toString().padStart(2, "0");

  return `${dd}/${mm}`;
};
