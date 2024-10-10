import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { CreateTripContext } from "../context/CreateTripContext";
import { useEffect, useState } from "react";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    outfit: require("./../assets/fonts/OpenSans-Regular.ttf"),
    outfitMedium: require("./../assets/fonts/OpenSans-Medium.ttf"),
    outfitSemibold: require("./../assets/fonts/OpenSans-SemiBold.ttf"),
    outfitBold: require("./../assets/fonts/OpenSans-Bold.ttf"),
  });

  const [tripData, setTripData] = useState([]);

  return (
    <CreateTripContext.Provider value={{ tripData, setTripData }}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* <Stack.Screen name="index" options={{ headerShown: false }} /> */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="detail-trip/TripDetail" options={{ headerShown: false }} />
      </Stack>
    </CreateTripContext.Provider>
  );
}
