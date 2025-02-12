import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SplashScreen } from "expo-router";
import { useEffect, useState } from "react";
import { isToday } from "date-fns";
import { addRecord, deleteRecord, editRecord, getRecords } from "@/lib/storage";
import { formatDate } from "@/lib/utils";
import WeightInput from "@/components/WeightInput";
//@ts-ignore
import Logo from "@/assets/images/icon.png";
import WeightItem from "@/components/WeightItem";
import { GestureHandlerRootView } from "react-native-gesture-handler";

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

  const onAddPress = async () => {
    const today = new Date().toISOString();
    await addRecord(weight, today);
    loadRecords();
  };

  const onReplacePress = async () => {
    const lastRecord = !!records && records[0];
    if (!lastRecord) return;
    await editRecord(lastRecord.id, weight);
    loadRecords();
  };

  const onDeletePress = async (id: number) => {
    await deleteRecord(id);
    loadRecords();
  };

  if (stale) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 px-5 pt-5">
        <GestureHandlerRootView>
          <FlatList
            contentContainerClassName="flex flex-col gap-10"
            data={records}
            keyExtractor={(record) => String(record.id)}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => {
              const previous =
                index + 1 < records.length
                  ? records[index + 1]
                  : records[index];
              const variation =
                parseFloat(item.weight) - parseFloat(previous.weight);
              return (
                <WeightItem
                  item={item}
                  variation={variation}
                  onDeletePress={onDeletePress}
                />
              );
            }}
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
                    onPress={isTodaySet ? onReplacePress : onAddPress}
                  >
                    <Text className="text-2xl font-semibold">
                      {isTodaySet ? "Replace" : "Add"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            }
          />
        </GestureHandlerRootView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
