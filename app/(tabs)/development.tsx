import { seed } from "@/lib/seed";
import { clearAllRecords, getRecords } from "@/lib/storage";
import { View, Text, TouchableOpacity } from "react-native";

export default function Development() {
  const onSeedPress = async () => {
    await seed();
    alert("Records seeded.");
  };

  const onGetPress = async () => {
    const records = await getRecords();
    console.log("🚀 ~ records:", records);
  };

  const onClearPress = async () => {
    await clearAllRecords();
    alert("Records cleared.");
  };

  return (
    <View className="p-8 w-full flex flex-col justify-center gap-4">
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
}
