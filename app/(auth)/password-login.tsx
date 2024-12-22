import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import CustomButton from "../../components/CustomButton";
import InputField from "../../components/InputField";
import { StatusBar } from "expo-status-bar";
import { icons } from "@/constants";

const PasswordLoginPage = () => {
  const { phoneNumber } = useLocalSearchParams();
  const [password, setPassword] = useState<string>("");

  const handleBack = () => {
    router.back();
  };
  const handleNext = () => {};

  const handleLogin = () => {
    // Handle login logic here
  };

  return (
    <ScrollView className="bg-white text-black flex-1">
      <View className="flex-1 justify-center items-center p-5 mt-14">
        <Text className="self-start font-JakartaMedium text-base text-black mb-4">
          Enter your password for {phoneNumber}
        </Text>
        <InputField
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          containerStyle="mb-4"
        />
        <View className="flex-row justify-between items-center p-5 mt-96">
          <TouchableOpacity
            onPress={handleBack}
            className="flex flex-row items-center bg-[#EEEEEE] rounded-full p-3"
          >
            <Image source={icons.backArrow} className="size-8" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleNext}
            className="flex flex-row items-center  bg-[#EEEEEE] rounded-full p-3"
            disabled={!password}
          >
            <Text className="mr-2 text-black font-JakartaMedium">Next</Text>
            <Image
              source={icons.forwardArrow}
              tintColor={"#212121"}
              className="size-8"
            />
          </TouchableOpacity>
        </View>
      </View>
      <StatusBar style="dark" />
    </ScrollView>
  );
};

export default PasswordLoginPage;
