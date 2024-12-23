import { View, Text, TextInput, ScrollView, Image } from "react-native";
import React, { useState } from "react";
import CustomButton from "../../components/CustomButton";
import { router, useRouter } from "expo-router";
import { images } from "@/constants";
import { useSignUp } from "@clerk/clerk-expo";
import { useOAuth } from "@clerk/clerk-expo";
import * as WebBrowser from "expo-web-browser";
import { fetchAPI } from "@/lib/fetch";

WebBrowser.maybeCompleteAuthSession();

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const { isLoaded, signUp } = useSignUp();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);

  const { startOAuthFlow: googleAuth } = useOAuth({ strategy: "oauth_google" });
  const { startOAuthFlow: githubAuth } = useOAuth({ strategy: "oauth_github" });

  const handleSignUp = async () => {
    if (!isLoaded) {
      console.error("Clerk is not loaded");
      return;
    }

    try {
      // Create a new user with Clerk
      const result = await signUp.create({
        emailAddress: email,
        password: password,
        firstName: name,
      });

      console.log("User created:", result);

      // Start verification process
      if (email) {
        await signUp.prepareEmailAddressVerification();
        setShowVerification(true);
      }
    } catch (error) {
      console.error("Error during sign-up:", error);
    }
  };

  const handleVerification = async () => {
    try {
      // Verify email
      if (emailOtp) {
        if (signUp) {
          const verificationResult =
            await signUp.attemptEmailAddressVerification({ code: emailOtp });
          console.log("Email verification result:", verificationResult);
        }
      }

      // Store the user in the database
      const apiResponse = await fetchAPI("/(api)/user", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          phone,
          clerkId: signUp?.createdUserId,
        }),
      });

      console.log("API response:", apiResponse);

      // If both verifications are successful
      console.log("Verification successful");

      router.replace("/(root)/(tabs)/home");
    } catch (error) {
      console.error("Error during verification:", error);
    }
  };

  const onGoogleAuth = async () => {
    try {
      setGoogleLoading(true);
      const { createdSessionId, signIn, signUp, setActive } =
        await googleAuth();

      if (createdSessionId) {
        if (setActive) {
          await setActive({ session: createdSessionId });
          setTimeout(() => {
            router.replace("/(root)/(tabs)/home");
          }, 100);
        } else {
          router.replace("/(root)/(tabs)/home");
        }
      }
    } catch (err) {
      console.error("Google OAuth error:", err);
    } finally {
      setGoogleLoading(false);
    }
  };

  const onGithubAuth = async () => {
    try {
      setGithubLoading(true);
      const { createdSessionId, signIn, signUp, setActive } =
        await githubAuth();

      if (createdSessionId) {
        if (setActive) {
          await setActive({ session: createdSessionId });
          setTimeout(() => {
            router.replace("/(root)/(tabs)/home");
          }, 100);
        } else {
          router.replace("/(root)/(tabs)/home");
        }
      }
    } catch (err) {
      console.error("GitHub OAuth error:", err);
    } finally {
      setGithubLoading(false);
    }
  };

  if (showVerification) {
    return (
      <ScrollView className="bg-white text-black flex-1">
        <View className="flex-1 justify-center items-center p-5 mt-14">
          <Image source={images.IconUber} className="w-24 h-24 mb-6" />
          <Text className="self-start font-JakartaMedium text-base text-black mb-4">
            Verify Your Account
          </Text>
          <TextInput
            placeholder="Email OTP"
            value={emailOtp}
            onChangeText={setEmailOtp}
            keyboardType="number-pad"
            className="w-full font-JakartaRegular text-base text-black mb-4 p-3 border border-gray-300 rounded"
          />

          <CustomButton
            onPress={handleVerification}
            title="Verify"
            bgColor="bg-black"
            textColor="text-white"
            className="mt-5"
          />
          <Text className="mt-4 text-sm text-gray-500">
            Please enter the verification codes sent to your email and phone
          </Text>
        </View>
      </ScrollView>
    );
  }

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
          onPress={onGoogleAuth}
          title="Continue with Google"
          bgColor="border"
          textColor="text-black"
          iconLeft={require("../../assets/icons/google.png")}
          className="mt-5"
          disabled={googleLoading}
        />
        <CustomButton
          onPress={onGithubAuth}
          title="Continue with Github"
          bgColor="border"
          textColor="text-black"
          iconLeft={require("../../assets/icons/github.png")}
          className="mt-5"
          disabled={githubLoading}
        />
      </View>
    </ScrollView>
  );
};

export default SignUpPage;
