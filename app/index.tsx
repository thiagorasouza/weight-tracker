import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SplashScreen } from "expo-router";
import { useEffect, useState } from "react";
import { isToday } from "date-fns";
import {
  addRecord,
  clearAllRecords,
  editRecord,
  getRecords,
} from "@/lib/storage";
import { formatDate } from "@/lib/utils";
import WeightInput from "@/components/WeightInput";
//@ts-ignore
import Logo from "@/assets/images/icon.png";
import { seed } from "@/lib/seed";

SplashScreen.preventAutoHideAsync();

export default function Index() {
  const [weight, setWeight] = useState<string>("00.00");
  const [records, setRecords] = useState<WeightRecord[]>();
  const stale = records === undefined;
  const isTodaySet =
    !!records && records.length > 0 && isToday(records[0].date);

  async function loadRecords() {
    const result = await getRecords();
    setRecords(result);

    // Sets input value to last weight if any
    if (result.length > 0) {
      setWeight(result[0].weight);
    }

    SplashScreen.hideAsync();
  }

  useEffect(() => {
    if (stale) {
      loadRecords();
    }
  }, [stale]);

  const onAddClick = async () => {
    const today = new Date().toISOString();
    await addRecord(weight, today);
    loadRecords();
  };

  const onReplaceClick = async () => {
    const lastRecord = !!records && records[0];
    if (!lastRecord) return;
    await editRecord(lastRecord.id, weight);
    loadRecords();
  };

  if (stale) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 px-5 pt-5">
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
              <View className="items-center my-20">
                <WeightInput value={weight} onChangeText={setWeight} />
                <TouchableOpacity
                  className="rounded-full px-7 py-3 bg-slate-400"
                  onPress={isTodaySet ? onReplaceClick : onAddClick}
                >
                  <Text className="text-2xl font-semibold">
                    {isTodaySet ? "Replace" : "Add"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          }
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
