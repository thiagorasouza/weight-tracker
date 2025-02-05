import AsyncStorage from "@react-native-async-storage/async-storage";

export const RECORDS_KEY_NAME = "records";
export const LAST_INDEX_KEY_NAME = "lastIndex";

// Adds a record at the start of the array
// Updates lastIndex
export async function addRecord(
  weight: WeightRecord["weight"],
  date: WeightRecord["date"],
) {
  try {
    const lastIndex = await getLastIndex();
    const record: WeightRecord = { id: lastIndex + 1, weight, date };

    const records = await getRecords();
    records.unshift(record);

    const recordsStr = JSON.stringify(records);
    AsyncStorage.setItem(RECORDS_KEY_NAME, recordsStr);
    AsyncStorage.setItem(LAST_INDEX_KEY_NAME, String(lastIndex));
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

// Returns an array of records or an empty array if stored value is invalid
export async function getRecords(): Promise<WeightRecord[]> {
  try {
    const records = await AsyncStorage.getItem(RECORDS_KEY_NAME);
    if (records === null) {
      return [];
    }

    const parsedRecords = JSON.parse(records);
    if (!Array.isArray(parsedRecords)) {
      throw new Error("Invalid records format.");
    }

    return parsedRecords as WeightRecord[];
  } catch (error) {
    console.log(error);
    return [];
  }
}

// Returns the last index or 0 if error or empty records
export async function getLastIndex(): Promise<number> {
  try {
    const lastIndex = await AsyncStorage.getItem(LAST_INDEX_KEY_NAME);
    if (lastIndex === null) {
      return 0;
    }

    return Number(lastIndex);
  } catch (error) {
    console.log(error);
    return 0;
  }
}

export async function clearAllRecords() {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
