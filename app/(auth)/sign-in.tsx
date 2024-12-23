import { View, Text, TextInput, ScrollView, Alert, Image } from "react-native";
import React, { useState } from "react";
import { useSignIn } from "@clerk/clerk-expo";
import CustomButton from "../../components/CustomButton";
import { Link, useRouter } from "expo-router";
import { useOAuth } from "@clerk/clerk-expo";
import { images } from "@/constants";
import * as WebBrowser from "expo-web-browser";
import { useAuth } from "@clerk/clerk-expo";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

WebBrowser.maybeCompleteAuthSession();

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, setActive } = useSignIn();
  const router = useRouter();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const { isSignedIn, signOut } = useAuth();

  const { startOAuthFlow: googleAuth } = useOAuth({ strategy: "oauth_google" });
  const { startOAuthFlow: githubAuth } = useOAuth({ strategy: "oauth_github" });

  // Add session check on component mount
  React.useEffect(() => {
    checkAndHandleExistingSession();
  }, []);

  const checkAndHandleExistingSession = async () => {
    try {
      if (isSignedIn) {
        // User is already signed in, redirect to home
        router.replace("/(root)/(tabs)/home");
      }
    } catch (error) {
      console.error("Session check error:", error);
    }
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      if (!signIn) {
        throw new Error("SignIn is not defined");
      }
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.replace("/(root)/(tabs)/home");
      } else {
        Alert.alert("Error", "Invalid credentials");
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

  const onGoogleAuth = async () => {
    try {
      setGoogleLoading(true);
      const { createdSessionId, signIn, signUp, setActive } =
        await googleAuth();

      if (createdSessionId) {
        // Ensure session is active before navigation
        if (setActive) {
          await setActive({ session: createdSessionId });
          // Add small delay to ensure session is set
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
        // Ensure session is active before navigation
        if (setActive) {
          await setActive({ session: createdSessionId });
          // Add small delay to ensure session is set
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

  return (
    <ScrollView className="bg-white text-black flex-1">
      <SafeAreaView>
        <View className="flex-1 justify-center items-center p-5 mt-14">
          <Image source={images.IconUber} className="w-24 h-24 mb-6" />
          <Text className="self-start font-JakartaMedium text-base text-black mb-4">
            Sign In
          </Text>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            className="w-full font-JakartaRegular text-base text-black mb-4"
            style={{
              borderColor: "#ddd",
              borderWidth: 1,
              borderRadius: 5,
              padding: 15,
            }}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            className="w-full font-JakartaRegular text-base text-black mb-4"
            style={{
              borderColor: "#ddd",
              borderWidth: 1,
              borderRadius: 5,
              padding: 15,
            }}
          />
          <CustomButton
            onPress={handleSignIn}
            title={isLoading ? "Please wait..." : "Sign In"}
            bgColor="bg-black"
            textColor="text-white"
            iconRight={require("../../assets/icons/right-arrow.png")}
            className="mt-5 "
            disabled={isLoading}
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
          <View className="flex-row items-center mt-8 ">
            <Text>Don't have an account!</Text>
            <Link href={"/(auth)/sign-up"} className="ml-2">
              <Text className="text-blue-700">Sign-Up</Text>
            </Link>
          </View>
        </View>
        <StatusBar style="dark" />
      </SafeAreaView>
    </ScrollView>
  );
};

export default SignInPage;
