import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";

interface CustomButtonProps {
  onPress: () => void;
  title: string;
  bgColor?: string;
  textColor?: string;
  iconLeft?: any;
  iconRight?: any;
  className?: string;
  disabled?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  onPress,
  title,
  bgColor = "bg-black",
  textColor = "text-white",
  iconLeft,
  iconRight,
  className,
  disabled,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`p-4 w-full rounded-lg ${bgColor} ${className}`}
      disabled={disabled}
    >
      <View className="flex-row justify-center items-center">
        {iconLeft && <Image source={iconLeft} className="w-5 h-5 mr-2" />}
        <Text className={`text-base font-semibold ${textColor} mr-2`}>
          {title}
        </Text>
        {iconRight && (
          <Image source={iconRight} className="w-5 h-5" tintColor={"white"} />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default CustomButton;
