import { addRecord, clearAllRecords } from "@/lib/storage";

const seedData = [
  { weight: "65.00", date: new Date("2025-01-22").toISOString() },
  { weight: "64.50", date: new Date("2025-01-23").toISOString() },
  { weight: "64.00", date: new Date("2025-01-24").toISOString() },
  { weight: "63.50", date: new Date("2025-01-25").toISOString() },
  { weight: "63.00", date: new Date("2025-01-26").toISOString() },
  { weight: "62.70", date: new Date("2025-01-27").toISOString() },
  { weight: "62.40", date: new Date("2025-01-28").toISOString() },
  { weight: "62.10", date: new Date("2025-01-29").toISOString() },
  { weight: "61.80", date: new Date("2025-01-30").toISOString() },
  { weight: "61.50", date: new Date("2025-01-31").toISOString() },
  { weight: "61.20", date: new Date("2025-02-01").toISOString() },
  { weight: "60.90", date: new Date("2025-02-02").toISOString() },
  { weight: "60.60", date: new Date("2025-02-03").toISOString() },
  { weight: "60.30", date: new Date("2025-02-04").toISOString() },
  { weight: "60.00", date: new Date("2025-02-05").toISOString() },
];

export async function seed() {
  await clearAllRecords();
  for (const data of seedData) {
    await addRecord(data.weight, data.date);
  }
}
