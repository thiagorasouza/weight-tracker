import { seed } from "@/lib/seed";
import {
  addRecord,
  clearAllRecords,
  editRecord,
  getRecords,
} from "@/lib/storage";
import { formatDate } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  NativeSyntheticEvent,
  Text,
  TextInput,
  TextInputKeyPressEventData,
  TouchableOpacity,
  View,
} from "react-native";
import { isToday, isYesterday } from "date-fns";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { SplashScreen } from "expo-router";

//@ts-ignore
import Logo from "@/assets/images/icon.png";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function Index() {
  const [weight, setWeight] = useState<string>("00.00");
  const [records, setRecords] = useState<WeightRecord[]>();
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const inputRef1 = useRef<TextInput>(null);
  const inputRef2 = useRef<TextInput>(null);
  const inputRef3 = useRef<TextInput>(null);
  const inputRef4 = useRef<TextInput>(null);

  async function loadRecords() {
    const result = await getRecords();
    setRecords(result);
    if (result.length > 0) {
      setWeight(result[0].weight);
    }
    SplashScreen.hideAsync();
  }

  useEffect(() => {
    if (records === undefined) {
      loadRecords();
    }
  }, [records]);

  const onSeedPress = async () => {
    await seed();
    loadRecords();
  };

  const onGetPress = async () => {
    const records = await getRecords();
    console.log("🚀 ~ records:", records);
  };

  const onClearPress = async () => {
    await clearAllRecords();
    loadRecords();
  };

  const formatWeight = (weight: string) => weight.replace(",", ".");

  const onAddClick = async () => {
    const today = new Date().toISOString();
    await addRecord(formatWeight(weight), today);
    loadRecords();
  };

  const loading = records === undefined;
  const empty = Array.isArray(records) && records.length === 0;
  const lastRecord = !loading && !empty && records[0];
  const lastWeight = lastRecord && lastRecord.weight;
  const lastDate = lastRecord && formatDate(lastRecord.date);
  const lastDateIsToday = lastRecord && isToday(lastRecord.date);

  const onEditClick = async () => {
    if (!lastRecord) return;
    await editRecord(lastRecord.id, formatWeight(weight));
    loadRecords();
  };

  const handleKeyPress1 = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
  ) => {
    const key = e.nativeEvent.key;
    if (key === "Backspace") {
      setWeight("0" + weight.slice(1));
      inputRef1.current?.setNativeProps({ selection: { start: 0, end: 1 } });
    } else if (/\d/.test(key)) {
      inputRef2.current?.focus();
      setWeight(key + weight.slice(1));
    }
  };

  const handleKeyPress2 = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
  ) => {
    const key = e.nativeEvent.key;
    if (key === "Backspace") {
      setWeight(weight[0] + "0" + weight.slice(2));
      inputRef1.current?.focus();
    } else if (/\d/.test(key)) {
      inputRef3.current?.focus();
      setWeight(weight[0] + key + weight.slice(2));
    }
  };

  const handleKeyPress3 = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
  ) => {
    const key = e.nativeEvent.key;
    if (key === "Backspace") {
      setWeight(weight.slice(0, 3) + "0" + weight.slice(4));
      inputRef2.current?.focus();
    } else if (/\d/.test(key)) {
      inputRef4.current?.focus();
      setWeight(weight.slice(0, 3) + key + weight.slice(4));
    }
  };

  const handleKeyPress4 = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
  ) => {
    const key = e.nativeEvent.key;
    if (key === "Backspace") {
      setWeight(weight.slice(0, 4) + "0");
      inputRef3.current?.focus();
    } else if (/\d/.test(key)) {
      inputRef4.current?.blur();
      setWeight(weight.slice(0, 4) + key);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 px-5 pt-5">
        {/* Weight Records Flat List */}
        {loading ? (
          <ActivityIndicator size="large" />
        ) : empty ? (
          <View className="flex items-center">
            <Text>No records found.</Text>
          </View>
        ) : (
          <FlatList
            contentContainerClassName="flex flex-col gap-8"
            data={records}
            keyExtractor={(record) => String(record.id)}
            renderItem={({ item }) => (
              <View className="flex gap-1 items-center">
                <Text className="text-xs">
                  {isToday(item.date) ? "today" : formatDate(item.date)}
                </Text>
                <Text className="text-3xl font-semibold">{item.weight}</Text>
              </View>
            )}
            ListEmptyComponent={
              <View className="flex items-center">
                <Text>No records found.</Text>
              </View>
            }
            ListHeaderComponent={
              <View className="items-center">
                <View className="flex flex-row items-center gap-3">
                  <Image source={Logo} className="size-8" />
                  <Text className="font-bold text-xl">Weight Tracker</Text>
                </View>
                <View className="self-start">
                  <Text>Today: {formatDate(new Date())}</Text>
                  <Text>Last Weight: {lastWeight}</Text>
                  <Text>Last Date: {lastDate}</Text>
                </View>
                <View className="flex flex-row items-center my-20">
                  <TextInput
                    ref={inputRef1}
                    className="text-8xl font-bold"
                    value={weight[0]}
                    selectTextOnFocus
                    keyboardType="numeric"
                    onKeyPress={handleKeyPress1}
                  />
                  <TextInput
                    ref={inputRef2}
                    className="text-8xl font-bold"
                    value={weight[1]}
                    selectTextOnFocus
                    keyboardType="numeric"
                    onKeyPress={handleKeyPress2}
                  />
                  <TextInput
                    className="text-8xl font-bold"
                    value={weight[2]}
                    readOnly
                  />
                  <TextInput
                    ref={inputRef3}
                    className="text-8xl font-bold"
                    value={weight[3]}
                    selectTextOnFocus
                    keyboardType="numeric"
                    onKeyPress={handleKeyPress3}
                  />
                  <TextInput
                    ref={inputRef4}
                    className="text-8xl font-bold"
                    value={weight[4]}
                    selectTextOnFocus
                    keyboardType="numeric"
                    onKeyPress={handleKeyPress4}
                  />
                  {/* {lastDateIsToday ? (
                    <>
                      <Text className="mb-4">today's weight</Text>
                      <TextInput
                        className="text-8xl font-bold"
                        value={weight}
                        onChangeText={handleTextChange}
                        defaultValue={lastRecord.weight}
                        selection={selection}
                        keyboardType="numeric"
                        returnKeyType="done"
                      />
                      <TouchableOpacity
                        className="rounded-full px-7 py-3  bg-slate-400"
                        onPress={onEditClick}
                      >
                        <Text className="text-2xl font-semibold">Edit</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <View className="items-center">
                        <Text className="font-semibold text-lg">
                          {lastWeight}
                        </Text>
                        <Text>(last weight)</Text>
                      </View>
                      <TextInput
                        className="text-8xl font-bold"
                        value={weight}
                        onChangeText={handleTextChange}
                        selection={selection}
                        keyboardType="numeric"
                        returnKeyType="done"
                        selectTextOnFocus
                      />
                      <TouchableOpacity
                        className="rounded-full px-7 py-3  bg-slate-400"
                        onPress={onAddClick}
                      >
                        <Text className="text-2xl font-semibold">Add</Text>
                      </TouchableOpacity>
                    </>
                  )} */}
                </View>
              </View>
            }
          />
        )}

        {/* Seed Data Buttons */}
        <View className="w-full flex flex-row justify-center gap-4">
          <TouchableOpacity
            className="bg-white border px-6 py-2 rounded-xl"
            onPress={onSeedPress}
          >
            <Text className="text-xl font-semibold">Seed</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-white border px-6 py-2 rounded-xl"
            onPress={onGetPress}
          >
            <Text className="text-xl font-semibold">Get</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-white border px-6 py-2 rounded-xl"
            onPress={onClearPress}
          >
            <Text className="text-xl font-semibold">Clear</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
