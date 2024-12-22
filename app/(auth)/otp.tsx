import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import CustomButton from "../../components/CustomButton";
import InputField from "../../components/InputField";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons"; // Add this import for icons
import { icons } from "@/constants";

const OtpPage = () => {
  const router = useRouter();
  const { phoneNumber } = useLocalSearchParams();

  const [otp, setOtp] = useState<string>("");

  const handleVerifyOtp = () => {
    // Handle OTP verification logic here
  };

  const handleLoginWithPassword = () => {
    router.push({
      pathname: "/(auth)/password-login",
      params: { phoneNumber },
    });
  };

  const handleBack = () => {
    router.back();
  };

  const handleNext = () => {
    // Handle next action here
    router.replace("/(root)/(tabs)/home");
  };

  const handleResendOtp = () => {
    // Handle resend OTP
  };

  return (
    <ScrollView className="bg-white text-black flex-1">
      <View className="flex-1 justify-center items-center p-5 mt-14">
        <Text className="self-start font-JakartaMedium text-base text-black mb-4">
          Enter 4 digit OTP sent to {phoneNumber}
        </Text>
        <InputField
          label="OTP"
          value={otp}
          onChangeText={setOtp}
          keyboardType="numeric"
          containerStyle="mb-4"
        />
        <View className="self-start">
          <TouchableOpacity onPress={handleResendOtp}>
            <Text className="text-black bg-[#EEEEEE] rounded-full p-3 font-JakartaMedium">
              I didn’t recive a code
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLoginWithPassword} className="mt-3">
            <Text className="text-black bg-[#EEEEEE] rounded-full p-3 font-JakartaMedium">
              Login with password
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className="flex-row justify-between items-center p-5 mt-96">
        <TouchableOpacity
          onPress={handleBack}
          className="flex flex-row items-center bg-[#EEEEEE] rounded-full p-3"
        >
          <Image source={icons.backArrow} className="size-8" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleNext}
          className={`flex flex-row items-center  bg-[#EEEEEE] rounded-full p-3 `}
          disabled={otp.length < 4}
        >
          <Text className="mr-2 text-black font-JakartaMedium">Next</Text>
          <Image
            source={icons.forwardArrow}
            tintColor={"#212121"}
            className="size-8"
          />
        </TouchableOpacity>
      </View>
      <StatusBar style="dark" />
    </ScrollView>
  );
};

export default OtpPage;
