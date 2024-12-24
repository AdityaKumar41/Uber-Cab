import { View, Text, Image } from "react-native";
import React from "react";
import { Ride } from "@/types/type";
import { icons } from "@/constants";
import { formatDate, formatTime } from "@/lib/utils";

const RideCard = ({ ride }: { ride: Ride }) => {
  return (
    <View className="flex flex-col bg-[#212121] rounded-lg shadow-sm shadow-neutral-300 mb-3 p-4">
      <View className="flex flex-row items-center justify-between">
        <Image
          source={{
            uri: `https://maps.geoapify.com/v1/staticmap?style=osm-bright-smooth&width=600&height=400&center=lonlat:${ride.destination_longitude},${ride.destination_latitude}&zoom=14&apiKey=${process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY}`,
          }}
          className="w-[80px] h-[90px] rounded-lg"
        />
        <View className="flex flex-col mx-5 flex-1">
          <View className="flex flex-row items-center gap-x-2 mb-2">
            <Image source={icons.to} className="w-5 h-5" tintColor={"white"} />
            <Text
              className="text-md font-JakartaMedium text-white"
              numberOfLines={1}
            >
              {ride.origin_address}
            </Text>
          </View>
          <View className="flex flex-row items-center gap-x-2">
            <Image
              source={icons.point}
              className="w-5 h-5"
              tintColor={"white"}
            />
            <Text
              className="text-md font-JakartaMedium text-white"
              numberOfLines={1}
            >
              {ride.destination_address}
            </Text>
          </View>
        </View>
      </View>
      <View className="flex flex-col w-full mt-4 rounded-lg items-start justify-center">
        <View className="flex flex-row items-center w-full justify-between mb-4">
          <Text className="text-md font-JakartaMedium text-gray-300">
            Date & Time
          </Text>
          <Text className="text-md font-JakartaMedium text-gray-300">
            {formatDate(ride.created_at)}, {formatTime(ride.ride_time)}
          </Text>
        </View>

        <View className="flex flex-row items-center w-full justify-between mb-4">
          <Text className="text-md font-JakartaMedium text-gray-300">
            Driver
          </Text>
          <Text className="text-md font-JakartaMedium text-gray-300">
            {ride.driver.first_name} {ride.driver.last_name}
          </Text>
        </View>

        <View className="flex flex-row items-center w-full justify-between mb-4">
          <Text className="text-md font-JakartaMedium text-gray-300">
            Car Seats
          </Text>
          <Text className="text-md font-JakartaMedium text-gray-300">
            {ride.driver.car_seats}
          </Text>
        </View>

        <View className="flex flex-row items-center w-full justify-between mb-4">
          <Text className="text-md font-JakartaMedium text-gray-300">
            Payment Status
          </Text>
          <Text
            className={`text-md capitalize font-JakartaMedium ${
              ride.payment_status === "paid" ? "text-green-500" : "text-red-500"
            }`}
          >
            {ride.payment_status}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default RideCard;
