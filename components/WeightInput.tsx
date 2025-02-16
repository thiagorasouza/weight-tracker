import {
  View,
  TextInput,
  TextInputKeyPressEventData,
  NativeSyntheticEvent,
  Text,
  Pressable,
} from "react-native";
import React, { useRef, useState } from "react";

export interface WeightInputProps {
  value: string;
  onChangeText: (weight: string) => void;
}

// A single component composed by 4 responsive numerical inputs
const WeightInput = ({
  value,
  onChangeText: onChangeText,
}: WeightInputProps) => {
  const [firstPress, setFirstPress] = useState(true);

  const inputRef1 = useRef<TextInput>(null);
  const inputRef2 = useRef<TextInput>(null);
  const inputRef3 = useRef<TextInput>(null);
  const inputRef4 = useRef<TextInput>(null);

  const handleKeyPress1 = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
  ) => {
    const key = e.nativeEvent.key;
    if (key === "Backspace") {
      onChangeText("0" + value.slice(1));
      inputRef1.current?.setNativeProps({ selection: { start: 0, end: 1 } });
    } else if (/\d/.test(key)) {
      inputRef2.current?.focus();
      onChangeText(key + value.slice(1));
    }
  };

  const handleKeyPress2 = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
  ) => {
    const key = e.nativeEvent.key;
    if (key === "Backspace") {
      onChangeText(value[0] + "0" + value.slice(2));
      inputRef1.current?.focus();
    } else if (/\d/.test(key)) {
      inputRef3.current?.focus();
      onChangeText(value[0] + key + value.slice(2));
    }
  };

  const handleKeyPress3 = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
  ) => {
    const key = e.nativeEvent.key;
    if (key === "Backspace") {
      onChangeText(value.slice(0, 3) + "0" + value.slice(4));
      inputRef2.current?.focus();
    } else if (/\d/.test(key)) {
      inputRef4.current?.focus();
      onChangeText(value.slice(0, 3) + key + value.slice(4));
    }
  };

  const handleKeyPress4 = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
  ) => {
    const key = e.nativeEvent.key;
    if (key === "Backspace") {
      onChangeText(value.slice(0, 4) + "0");
      inputRef3.current?.focus();
    } else if (/\d/.test(key)) {
      inputRef4.current?.blur();
      onChangeText(value.slice(0, 4) + key);
    }
  };

  const onWeightPress = () => {
    if (firstPress) {
      inputRef1.current?.focus();
      setFirstPress(false);
    }
  };

  return (
    <View>
      {/* <Pressable onPress={onWeightPress}>
        <View
          className={`flex-row items-center ${!showInput ? "flex" : "hidden"}`}
        >
          <Text className="text-8xl font-bold tracking-wider">{value}</Text>
          <Text className="self-end mb-[17px] font-bold text-3xl">kg</Text>
        </View>
      </Pressable> */}
      <Pressable onPress={onWeightPress}>
        <View className="flex flex-row items-center">
          <TextInput
            ref={inputRef1}
            className="text-8xl font-bold leading-[96px]"
            value={value[0]}
            selectTextOnFocus
            keyboardType="number-pad"
            onKeyPress={handleKeyPress1}
          />
          <TextInput
            ref={inputRef2}
            className="text-8xl font-bold leading-[96px]"
            value={value[1]}
            selectTextOnFocus
            keyboardType="number-pad"
            onKeyPress={handleKeyPress2}
            pointerEvents={firstPress ? "none" : "auto"}
          />
          <TextInput
            className="text-8xl font-bold leading-[96px]"
            value={value[2]}
            readOnly
            pointerEvents={firstPress ? "none" : "auto"}
          />
          <TextInput
            ref={inputRef3}
            className="text-8xl font-bold leading-[96px]"
            value={value[3]}
            selectTextOnFocus
            keyboardType="number-pad"
            onKeyPress={handleKeyPress3}
            pointerEvents={firstPress ? "none" : "auto"}
          />
          <TextInput
            ref={inputRef4}
            className="text-8xl font-bold leading-[96px]"
            value={value[4]}
            selectTextOnFocus
            keyboardType="number-pad"
            onKeyPress={handleKeyPress4}
            pointerEvents={firstPress ? "none" : "auto"}
          />
          <Text className="self-end mb-[17px] font-bold text-3xl">kg</Text>
        </View>
      </Pressable>
    </View>
  );
};

export default WeightInput;
