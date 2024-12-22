import { View, Text, ScrollView, Alert } from "react-native";
import React, { useState, useCallback } from "react";
import PhoneInput from "react-native-phone-input";
import { StatusBar } from "expo-status-bar";
import CustomButton from "../../components/CustomButton";
import { Link, useRouter } from "expo-router";
import { useSignIn, useOAuth } from "@clerk/clerk-expo";
import { OAuthStrategy } from "@clerk/types";
import * as WebBrowser from "expo-web-browser";

// Initialize WebBrowser
WebBrowser.maybeCompleteAuthSession();

const SignInPage = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // OAuth handling with proper strategy types
  const { startOAuthFlow: googleAuth } = useOAuth({ strategy: "oauth_google" });
  const { startOAuthFlow: githubAuth } = useOAuth({ strategy: "oauth_github" });

  const [value, setValue] = useState<string | undefined>();
  const phoneRef = React.useRef<PhoneInput>(null);

  const updateInfo = () => {
    if (phoneRef.current) {
      setValue(phoneRef.current.getValue());
    }
  };

  const handleNext = () => {
    if (!value) {
      Alert.alert("Error", "Please enter a valid phone number");
      return;
    }
    router.push({ pathname: "/(auth)/otp", params: { phoneNumber: value } });
  };

  const onGoogleAuth = async () => {
    try {
      setLoading(true);
      const result = await googleAuth();

      if (!result) {
        Alert.alert("Error", "Google authentication failed");
        return;
      }

      const { createdSessionId, setActive: setOAuthActive } = result;

      if (createdSessionId && setOAuthActive) {
        await setOAuthActive({ session: createdSessionId });
        router.replace("/(root)/(tabs)/home");
      }
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to authenticate with Google");
      console.error("Google OAuth error:", err);
    } finally {
      setLoading(false);
    }
  };

  const onGithubAuth = async () => {
    try {
      setLoading(true);
      const result = await githubAuth();

      if (!result) {
        Alert.alert("Error", "GitHub authentication failed");
        return;
      }

      const { createdSessionId, setActive: setOAuthActive } = result;

      if (createdSessionId && setOAuthActive) {
        await setOAuthActive({ session: createdSessionId });
        router.replace("/(root)/(tabs)/home");
      }
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to authenticate with GitHub");
      console.error("GitHub OAuth error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <ScrollView className="bg-white text-black flex-1">
      <View className="flex-1 justify-center items-center p-5 mt-14">
        <Text className="self-start font-JakartaMedium text-base text-black mb-4">
          Enter your mobile number
        </Text>
        <View className="w-full font-JakartaRegular text-base text-black mb-4">
          <PhoneInput
            ref={phoneRef}
            initialCountry="in"
            flagStyle={{ width: 30, height: 20 }}
            textStyle={{ fontSize: 16 }}
            onChangePhoneNumber={updateInfo}
            style={{
              borderColor: "#ddd",
              borderWidth: 1,
              borderRadius: 5,
              padding: 15,
            }}
          />
        </View>
        <CustomButton
          onPress={handleNext}
          title="Next"
          bgColor="bg-black"
          textColor="text-white"
          iconRight={require("../../assets/icons/right-arrow.png")}
          className="mt-5 "
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
          onPress={onGoogleAuth}
          title={loading ? "Loading..." : "Continue with Google"}
          bgColor="border"
          textColor="text-black"
          iconLeft={require("../../assets/icons/google.png")}
          className="mt-5"
          disabled={loading}
        />

        <CustomButton
          onPress={onGithubAuth}
          title={loading ? "Loading..." : "Continue with Github"}
          bgColor="border"
          textColor="text-black"
          iconLeft={require("../../assets/icons/github.png")}
          className="mt-5"
          disabled={loading}
        />
        <View className="flex-row items-center mt-8 ">
          <Text>Don't have an account!</Text>
          <Link href={"/(auth)/sign-up"} className="ml-2">
            <Text className="text-blue-700">Sign-Up</Text>
          </Link>
        </View>
      </View>
      <StatusBar style="dark" />
    </ScrollView>
  );
};

export default SignInPage;
