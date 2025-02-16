import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SplashScreen } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { isToday } from "date-fns";
import { addRecord, deleteRecord, editRecord, getRecords } from "@/lib/storage";
import WeightInput from "@/components/WeightInput";
//@ts-ignore
import Logo from "@/assets/images/icon.png";
import WeightItem from "@/components/WeightItem";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Ionicons from "@expo/vector-icons/Ionicons";

SplashScreen.preventAutoHideAsync();

const PAGE_SIZE = 15;
const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function Home() {
  const [weight, setWeight] = useState<string>("00.00");
  const [records, setRecords] = useState<WeightRecord[]>();
  const [pagination, setPagination] = useState<{
    start: number;
    end: number;
  }>();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const listRef = useRef<FlatList>(null);

  const stale = records === undefined;
  const isTodaySet =
    !!records && records.length > 0 && isToday(records[0].date);

  async function loadRecords() {
    const result = await getRecords();
    setRecords(result);

    const total = result.length;
    if (total > PAGE_SIZE) {
      setPagination({ start: 0, end: PAGE_SIZE });
    }

    // Sets input value to last weight if any
    // if (result.length > 0) {
    //   setWeight(result[0].weight);
    // }

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

  const onEndReached = async () => {
    if (stale || !pagination) return;

    const total = records.length;

    if (pagination.end >= total) return;

    // await new Promise((resolve) => setTimeout(resolve, 500));

    setPagination({
      start: pagination.start,
      end:
        total - pagination.end > PAGE_SIZE ? pagination.end + PAGE_SIZE : total,
    });
  };

  const onListScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollHeight = event.nativeEvent.contentOffset.y;
    if (scrollHeight > SCREEN_HEIGHT * 0.5) {
      setShowBackToTop(true);
    } else {
      setShowBackToTop(false);
    }
  };

  const onBackToTopPress = () => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  if (stale) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 px-5 pt-5">
        <GestureHandlerRootView>
          <View className="relative">
            <FlatList
              contentContainerClassName="flex flex-col gap-14 pb-10"
              data={
                pagination
                  ? records.slice(pagination.start, pagination.end)
                  : records
              }
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
              // ListFooterComponent={
              //   <View className="my-3">
              //     {pagination && pagination.end < records.length && (
              //       <ActivityIndicator />
              //     )}
              //   </View>
              // }
              onEndReachedThreshold={0.1}
              onEndReached={onEndReached}
              onScroll={onListScroll}
              scrollEventThrottle={200}
              ref={listRef}
            />
            {showBackToTop && (
              <TouchableOpacity
                onPress={onBackToTopPress}
                className="rounded-full p-5 bg-white absolute right-[12px] bottom-[24px]"
              >
                <Ionicons name="arrow-up" color="black" size={18} />
              </TouchableOpacity>
            )}
          </View>
        </GestureHandlerRootView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
