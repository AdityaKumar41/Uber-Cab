import { View, Text, TextInput, ScrollView, Image } from "react-native";
import React, { useState } from "react";
import CustomButton from "../../components/CustomButton";
import { useRouter } from "expo-router";
import { images } from "@/constants";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignUp = () => {
    // Handle sign-up logic here
    router.push("/(auth)/sign-in");
  };

  return (
    <ScrollView className="bg-white text-black flex-1">
      <View className="flex-1 justify-center items-center p-5 mt-14">
        <Image source={images.IconUber} className="w-24 h-24 mb-6" />
        <Text className="self-start font-JakartaMedium text-base text-black mb-4">
          Sign Up
        </Text>
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={setName}
          className="w-full font-JakartaRegular text-base text-black mb-4 p-3 border border-gray-300 rounded"
        />
        <TextInput
          placeholder="Phone Number"
          value={phone}
          onChangeText={setPhone}
          className="w-full font-JakartaRegular text-base text-black mb-4 p-3 border border-gray-300 rounded"
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          className="w-full font-JakartaRegular text-base text-black mb-4 p-3 border border-gray-300 rounded"
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          className="w-full font-JakartaRegular text-base text-black mb-4 p-3 border border-gray-300 rounded"
        />
        <CustomButton
          onPress={handleSignUp}
          title="Sign Up"
          bgColor="bg-black"
          textColor="text-white"
          className="mt-5"
        />

        <View className="w-full mt-8">
          <Text className="text-justify font-JakartaRegular text-sm text-[#757575]">
            By continuing you may receive an SMS for verification. Message and
            data rates may apply
          </Text>
        </View>
        <View className="flex-row items-center mt-8 w-full">
          <View className="flex-1 border-t border-gray-300"></View>
          <Text className="mx-4 text-gray-500">OR</Text>
          <View className="flex-1 border-t border-gray-300"></View>
        </View>
        <CustomButton
          onPress={() => {}}
          title="Continue with Google"
          bgColor="border"
          textColor="text-black"
          iconLeft={require("../../assets/icons/google.png")}
          className="mt-5"
        />
        <CustomButton
          onPress={() => {}}
          title="Continue with Github"
          bgColor="border"
          textColor="text-black"
          iconLeft={require("../../assets/icons/github.png")}
          className="mt-5"
        />
      </View>
    </ScrollView>
  );
};

export default SignUpPage;
