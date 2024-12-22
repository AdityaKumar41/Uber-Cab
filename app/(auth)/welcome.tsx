import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

const Onbording = () => {
  return (
    <SafeAreaView className="flex-1 items-center bg-[#276EF1]">
      <View className="flex-1 justify-center items-center px-6">
        <Image
          source={require("../../assets/images/logo.png")}
          resizeMode="contain"
          className="w-24 h-24 mb-6"
        />
        <Image
          source={require("../../assets/images/onboarding1.png")}
          resizeMode="contain"
          className="w-72 h-72 mb-6"
        />
        <Text className="text-4xl font-bold text-white mb-3 font-JakartaBold text-center">
          Move with safety
        </Text>
        <Text className="text-lg text-white mb-6 text-center px-8">
          Experience the best ride with our top-notch safety features.
        </Text>
        <TouchableOpacity
          className="bg-black p-5 w-96 mt-32 rounded-lg"
          onPress={() => {
            router.replace("/(auth)/sign-in");
          }}
        >
          <View className="flex-row justify-center items-center">
            <Text className="text-white text-base font-semibold mr-2">
              Get started
            </Text>
            <Image
              source={require("../../assets/icons/right-arrow.png")}
              className="w-5 h-5"
            />
          </View>
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

export default Onbording;
