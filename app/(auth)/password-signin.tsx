import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { useSignIn } from "@clerk/clerk-expo";
import CustomButton from "../../components/CustomButton";
import { MaterialIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

const PasswordSignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, setActive } = useSignIn();
  const router = useRouter();

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      if (!signIn) {
        throw new Error("SignIn is not available");
      }

      // First check if user exists
      const signInAttempt = await signIn.create({
        identifier: email,
      });

      // Attempt password login
      const response = await signInAttempt.attemptFirstFactor({
        strategy: "password",
        password,
      });

      if (response.status === "complete") {
        await setActive({ session: response.createdSessionId });
        router.replace("/(root)/(tabs)/home");
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message === "Invalid credentials"
          ? "Invalid email or password"
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <SafeAreaView>
        <View className="p-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center rounded-full bg-gray-100"
          >
            <MaterialIcons name="arrow-back" size={24} />
          </TouchableOpacity>
        </View>

        <View className="px-4 pt-6">
          <Text className="text-3xl font-bold mb-2">Welcome back</Text>
          <Text className="text-gray-500 text-base mb-8">
            Sign in with your email and password
          </Text>

          <View className="space-y-4">
            <View>
              <Text className="text-gray-600 mb-2 text-base">Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                className="border border-gray-300 p-4 rounded-xl text-base"
              />
            </View>

            <View>
              <Text className="text-gray-600 mb-2 text-base">Password</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry
                className="border border-gray-300 p-4 rounded-xl text-base"
              />
            </View>
          </View>

          <CustomButton
            onPress={handleSignIn}
            title={isLoading ? "Signing in..." : "Sign In"}
            bgColor={email && password ? "bg-black" : "bg-gray-300"}
            textColor="text-white"
            className="mt-8"
            disabled={isLoading || !email || !password}
          />

          <TouchableOpacity
            //   onPress={() => router.push("/forgot-password")}
            className="mt-4 items-center"
          >
            <Text className="text-black font-medium">Forgot password?</Text>
          </TouchableOpacity>
        </View>
        <StatusBar style="dark" />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default PasswordSignIn;
