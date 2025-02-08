import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { seed } from "@/lib/seed";
import { clearAllRecords, getRecords } from "@/lib/storage";

const SeedPage = () => {
  const onSeedPress = async () => {
    await seed();
  };

  const onGetPress = async () => {
    const records = await getRecords();
    console.log("🚀 ~ records:", records);
  };

  const onClearPress = async () => {
    await clearAllRecords();
  };

  return (
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
  );
};

export default SeedPage;
