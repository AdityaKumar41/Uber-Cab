import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useLocalSearchParams, useRouter, Link } from "expo-router";
import { useSignIn } from "@clerk/clerk-expo";
import CustomButton from "../../components/CustomButton";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { MaterialIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";

const CELL_COUNT = 6;
const RESEND_COOLDOWN = 30;

const OTPScreen = () => {
  const { phoneNumber, signInId } = useLocalSearchParams();
  const { signIn, setActive } = useSignIn();
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const handleVerification = async () => {
    if (value.length !== CELL_COUNT) {
      Alert.alert("Error", "Please enter a valid code");
      return;
    }

    setIsLoading(true);
    try {
      const signInAttempt = await signIn?.attemptFirstFactor({
        strategy: "phone_code",
        code: value,
      });

      if (signInAttempt?.status === "complete") {
        if (setActive) {
          await setActive({ session: signInAttempt.createdSessionId });
        }
        router.replace("/(root)/(tabs)/home");
      } else {
        Alert.alert("Error", "Invalid verification code");
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    setIsLoading(true);
    try {
      const { supportedFirstFactors } = await signIn!.create({
        identifier: phoneNumber as string,
      });

      const phoneCodeFactor = supportedFirstFactors?.find(
        (factor) => factor.strategy === "phone_code"
      );

      if (phoneCodeFactor && "phoneNumberId" in phoneCodeFactor) {
        await signIn!.prepareFirstFactor({
          strategy: "phone_code",
          phoneNumberId: phoneCodeFactor.phoneNumberId,
        });

        setCountdown(RESEND_COOLDOWN);
        setCanResend(false);
        Alert.alert("Success", "OTP has been resent to your phone number");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    return `${Math.floor(seconds / 60)}:${(seconds % 60)
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView className="flex-1 bg-white">
        <TouchableOpacity activeOpacity={1} onPress={Keyboard.dismiss}>
          <View className="p-4">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 items-center justify-center rounded-full bg-gray-100"
            >
              <MaterialIcons name="arrow-back" size={24} />
            </TouchableOpacity>
          </View>

          <View className="px-4 pt-6">
            <Text className="text-3xl font-bold mb-2">
              Enter verification code
            </Text>
            <Text className="text-gray-500 text-base mb-8">
              We sent a code to {phoneNumber}
            </Text>

            <CodeField
              ref={ref}
              {...props}
              value={value}
              onChangeText={setValue}
              cellCount={CELL_COUNT}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              rootStyle={{
                marginBottom: 32,
                justifyContent: "space-between",
                marginHorizontal: 20,
              }}
              renderCell={({ index, symbol, isFocused }) => (
                <View
                  key={index}
                  onLayout={getCellOnLayoutHandler(index)}
                  className={`w-12 h-14 border-2 rounded-xl items-center justify-center
                ${isFocused ? "border-black bg-gray-50" : "border-gray-300"}
                ${symbol ? "border-black" : ""}`}
                >
                  <Text className="text-2xl font-bold text-black">
                    {symbol || (isFocused ? <Cursor /> : null)}
                  </Text>
                </View>
              )}
            />

            <CustomButton
              onPress={handleVerification}
              title={isLoading ? "Verifying..." : "Verify Code"}
              bgColor={value.length === CELL_COUNT ? "bg-black" : "bg-gray-300"}
              textColor="text-white"
              className="mb-6"
              disabled={isLoading || value.length !== CELL_COUNT}
            />

            <View className="items-center mb-6">
              <Text className="text-gray-500 mb-2">
                Didn't receive the code?
              </Text>
              {canResend ? (
                <TouchableOpacity
                  onPress={handleResendOTP}
                  disabled={isLoading}
                  className="p-2"
                >
                  <Text className="text-black font-semibold text-lg">
                    Resend Code
                  </Text>
                </TouchableOpacity>
              ) : (
                <Text className="text-gray-400 text-lg font-medium">
                  Resend in {formatTime(countdown)}
                </Text>
              )}
            </View>

            <View className="mt-auto">
              <View className="flex-row items-center mb-6">
                <View className="flex-1 h-[1px] bg-gray-300" />
                <Text className="mx-4 text-gray-500">or</Text>
                <View className="flex-1 h-[1px] bg-gray-300" />
              </View>

              <TouchableOpacity
                className="flex-row items-center justify-center p-4 border border-gray-300 rounded-xl"
                onPress={() => router.push("/(auth)/password-signin")}
              >
                <MaterialIcons
                  name="lock"
                  size={20}
                  color="black"
                  style={{ marginRight: 8 }}
                />
                <Text className="font-semibold text-base">
                  Sign in with password
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
};

export default OTPScreen;
