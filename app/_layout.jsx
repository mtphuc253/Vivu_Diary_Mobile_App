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
import { ActivityIndicator } from "react-native";
import { View } from "react-native";
import * as Updates from 'expo-updates';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    outfit: require("./../assets/fonts/OpenSans-Regular.ttf"),
    outfitMedium: require("./../assets/fonts/OpenSans-Medium.ttf"),
    outfitRegular: require("./../assets/fonts/OpenSans-Regular.ttf"),
    outfitSemibold: require("./../assets/fonts/OpenSans-SemiBold.ttf"),
    outfitBold: require("./../assets/fonts/OpenSans-Bold.ttf"),
  });

  const [tripData, setTripData] = useState([]);
  const [planData, setPlanData] = useState([]);

  async function checkForUpdates() {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        alert('Cập nhật mới đã được tải xuống. Ứng dụng sẽ khởi động lại.');
        await Updates.reloadAsync();
      }
    } catch (e) {
      console.error(e);
      alert('Đã xảy ra lỗi khi kiểm tra cập nhật.');
    }
  }

  useEffect(() => {
    async function hideSplashScreen() {
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    }
    hideSplashScreen();
  }, [fontsLoaded]);

  useEffect(() => {
    checkForUpdates();

  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <CreateTripContext.Provider value={{ tripData, setTripData, planData, setPlanData }}>
      <Stack screenOptions={{
        headerShown: false,
        // headerTransparent: true,
      }}>
        {/* <Stack.Screen name="index" options={{ headerShown: false }} /> */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="detail-trip" options={{ headerShown: false }} />
      </Stack>
    </CreateTripContext.Provider>
  );
}
