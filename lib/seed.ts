import { addRecord, clearAllRecords } from "@/lib/storage";

function generateSeedData() {
  const seedData = [];
  const today = new Date();
  let weight = 80.0; // Peso inicial

  for (let i = 60; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);

    const variation = (Math.random() * 0.6 - 0.3).toFixed(2);
    weight = Math.max(weight + parseFloat(variation), 60.0);

    seedData.push({ weight: weight.toFixed(2), date: date.toISOString() });
  }

  return seedData;
}

const seedData = generateSeedData();

export async function seed() {
  await clearAllRecords();
  for (const data of seedData) {
    await addRecord(data.weight, data.date);
  }
}
