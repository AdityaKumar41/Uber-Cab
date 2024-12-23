import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";
import { useAuth } from "@clerk/clerk-expo";
import Colors from "@/constants/Colors";
import { StatusBar } from "expo-status-bar";

const HomePage = () => {
  const { user } = useUser();
  const { signOut } = useAuth();
  console.log(user);
  return (
    <SafeAreaView className="flex-1 bg-[#0f0f0f]">
      <ScrollView className="flex-1 " showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 pt-4">
          <View>
            <Text className="text-[16px] text-gray-600">Your location</Text>
            <TouchableOpacity className="flex-row items-center gap-1">
              <Text className="text-[20px] font-semibold">
                San Francisco, CA
              </Text>
              <MaterialIcons name="keyboard-arrow-down" size={24} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => signOut()}
            className="bg-gray-100 p-2 rounded-full"
          >
            <Image
              source={{ uri: user?.imageUrl }}
              className="w-12 h-12 rounded-full"
            />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="mx-4 mt-6">
          <View className="flex-row items-center bg-gray-100 p-3 rounded-full">
            <MaterialIcons name="search" size={24} color="gray" />
            <TextInput
              placeholder="Where to?"
              className="ml-2 flex-1"
              placeholderTextColor="gray"
            />
          </View>
        </View>

        {/* Categories */}
        <View className="mt-6">
          <Text className="text-[20px] font-bold px-4 mb-4">Get a ride</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="px-4"
          >
            {["Ride", "Reserve", "Intercity"].map((category, index) => (
              <TouchableOpacity
                key={index}
                className="mr-4 items-center justify-center bg-gray-100 rounded-lg p-4 w-24 h-24"
              >
                <MaterialIcons name="local-taxi" size={32} />
                <Text className="mt-2 text-center">{category}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Destinations */}
        <View className="mt-6 px-4">
          <Text className="text-[20px] font-bold mb-4">
            Popular destinations
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {["Airport", "Downtown", "Shopping Mall"].map((dest, index) => (
              <TouchableOpacity
                key={index}
                className="mr-4 bg-white shadow-md rounded-lg overflow-hidden w-40"
              >
                <Image
                  source={{ uri: "https://picsum.photos/200" }}
                  className="w-full h-24"
                />
                <View className="p-3">
                  <Text className="font-semibold">{dest}</Text>
                  <Text className="text-gray-500 text-sm">15 min away</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

export default HomePage;
