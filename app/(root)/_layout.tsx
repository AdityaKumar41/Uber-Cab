import { View } from "react-native";
import React from "react";
import { router, Stack } from "expo-router";
import Colors from "@/constants/Colors";
import { useAuth } from "@clerk/clerk-expo";

const RootLayout = () => {
  const { isSignedIn, isLoaded } = useAuth();

  React.useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/(auth)/welcome");
    }
  }, [isSignedIn, isLoaded]);

  if (!isLoaded || !isSignedIn) return null;

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(modals)/location-search"
        options={{
          presentation: "modal",
          headerTitle: "Select location",
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: "white",
          },
        }}
      />
      <Stack.Screen
        name="(modals)/booking-modal"
        options={{
          presentation: "modal",
          headerTitle: "Booking Details",
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
};

export default RootLayout;
