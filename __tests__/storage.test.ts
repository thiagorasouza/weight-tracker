import AsyncStorage from "@react-native-async-storage/async-storage";
import { describe, it, expect } from "@jest/globals";
import {
  addRecord,
  getLastIndex,
  getRecords,
  LAST_INDEX_KEY_NAME,
  RECORDS_KEY_NAME,
} from "@/lib/storage";

const mockRecords = [
  {
    id: 1,
    weight: "60.20",
    date: new Date("2025-02-05").toISOString(),
  },
  {
    id: 2,
    weight: "60.50",
    date: new Date("2025-02-04").toISOString(),
  },
];

const mockData = {
  weight: "60.00",
  date: new Date("2025-02-06").toISOString(),
};

const storeMockRecords = async () => {
  await AsyncStorage.setItem(RECORDS_KEY_NAME, JSON.stringify(mockRecords));
  await AsyncStorage.setItem(LAST_INDEX_KEY_NAME, String(mockRecords.length));
};

describe("Storage Test Suite", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  describe(`storage.${getRecords.name}`, () => {
    it("test for existing items", async () => {
      await storeMockRecords();
      const result = await getRecords();
      expect(result).toStrictEqual(mockRecords);
    });

    it("test for no records", async () => {
      const result = await getRecords();
      expect(result).toStrictEqual([]);
    });
  });

  describe(`storage.${getLastIndex.name}`, () => {
    it("test for existing items", async () => {
      await storeMockRecords();
      const result = await getLastIndex();
      expect(result).toStrictEqual(2);
    });

    it("test for no items", async () => {
      const result = await getLastIndex();
      expect(result).toStrictEqual(0);
    });
  });

  describe(`storage.${addRecord.name}`, () => {
    it("test for no items", async () => {
      await addRecord(mockData.weight, mockData.date);
      const result = await getRecords();
      expect(result).toStrictEqual([
        {
          id: 1,
          ...mockData,
        },
      ]);
    });

    it("test for existing items", async () => {
      await storeMockRecords();
      await addRecord(mockData.weight, mockData.date);
      const result = await getRecords();
      expect(result).toStrictEqual([
        {
          id: 3,
          ...mockData,
        },
        ...mockRecords,
      ]);
    });
  });
});
