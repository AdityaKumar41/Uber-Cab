import { View, Text } from "react-native";
import React from "react";

const GoogleTextInput = ({
  icon,
  initalLocation,
  containerStyle,
  textInputBackgroundColor,
  handlePress,
}) => {
  return (
    <View
      className={`flex flex-row items-center justify-center relative z-50 rounded-xl ${containerStyle} mb-5`}
    >
      <Text className="text-white">GoogleTextInput</Text>
    </View>
  );
};

export default GoogleTextInput;
