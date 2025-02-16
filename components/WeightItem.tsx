import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Ionicons from "@expo/vector-icons/Ionicons";
import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { isToday, isYesterday } from "date-fns";
import { formatDate } from "@/lib/utils";
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

interface RightActionProps {
  drag: SharedValue<number>;
  onPress: () => void;
}

export const DeleteAction = ({ drag, onPress }: RightActionProps) => {
  const styleAnimation = useAnimatedStyle(() => ({
    transform: [{ translateX: drag.value + 70 }],
  }));

  return (
    <Reanimated.View style={styleAnimation} className="w-[70px]">
      <TouchableOpacity
        onPress={onPress}
        className="w-full h-full items-center justify-center bg-red-500"
      >
        <Ionicons name="trash" size={16} color="white" />
      </TouchableOpacity>
    </Reanimated.View>
  );
};

interface WeightItemProps {
  item: WeightRecord;
  variation: number;
  onDeletePress: (id: number) => void;
}

const WeightItem = ({ item, variation, onDeletePress }: WeightItemProps) => {
  const isDateToday = isToday(item.date);
  const isDateYesterday = isYesterday(item.date);

  let content;
  if (isDateToday) {
    content = (
      <>
        <Text className="font-semibold text-lg">today</Text>
        <View>
          <Text className="text-6xl font-semibold">{item.weight}</Text>
        </View>
      </>
    );
  } else if (isDateYesterday) {
    content = (
      <>
        <Text className="text-lg">yesterday</Text>
        <View>
          <Text className="text-[38px] font-semibold">{item.weight}</Text>
        </View>
      </>
    );
  } else {
    content = (
      <>
        <Text>{formatDate(item.date)}</Text>
        <View>
          <Text className="text-3xl font-semibold">{item.weight}</Text>
        </View>
      </>
    );
  }

  return (
    <Swipeable
      friction={2}
      enableTrackpadTwoFingerGesture
      renderRightActions={(_, drag) => (
        <DeleteAction drag={drag} onPress={() => onDeletePress(item.id)} />
      )}
    >
      <View className="flex gap-3 items-center">
        {content}
        <Text
          className={`font-bold ${variation > 0 ? "text-red-300" : "text-green-500"}`}
        >
          {variation > 0 && "+"}
          {variation.toFixed(2)}
        </Text>
      </View>
    </Swipeable>
  );
};

export default WeightItem;
