import { Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FontAwesome, MaterialIcons, AntDesign, FontAwesome6, Ionicons, SimpleLineIcons } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TabLayout() {
  const [theme, setTheme] = useState('default');

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('@theme');
        setTheme(storedTheme === 'Halloween' ? 'Halloween' : 'default');
      } catch (error) {
        console.error('Error fetching theme from AsyncStorage:', error);
      }
    };

    fetchTheme();
  }, []);

  const styles = createStyles(theme);

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'mytrip') {
            return (
              <View style={[styles.myTripIconContainer, focused && styles.myTripIconFocused]}>
                <Ionicons name="airplane-outline" size={30} color={Colors.WHITE} />
              </View>
            );
          } else if (route.name === 'discovery') {
            return <Ionicons name="search-outline" size={24} color={color} />;
          } else if (route.name === 'myplan') {
            return <SimpleLineIcons name="notebook" size={24} color={color} />;
          }
          else if (route.name === 'profile') {
            return <AntDesign name="user" size={24} color={color} />;
          }
          else if (route.name === 'home') {
            return <AntDesign name="home" size={24} color={color} />;
          }
        },
        tabBarStyle: styles.tabBarStyle,
        tabBarItemStyle: { paddingBottom: 10 },
        tabBarActiveTintColor: theme === 'Halloween' ? Colors.HALLOWEEN : Colors.PRIMARY,
        tabBarInactiveTintColor: theme === 'Halloween' ? Colors.LIGHT_ORANGE : 'gray',
      })}
    >
      <Tabs.Screen name="home" options={{ title: 'Trang chủ' }} />
      <Tabs.Screen name="discovery" options={{ title: 'Khám phá' }} />
      <Tabs.Screen name="mytrip" options={{ title: 'Nhật ký' }} />
      <Tabs.Screen name="myplan" options={{ title: 'Kế hoạch' }} />
      <Tabs.Screen name="profile" options={{ title: 'Hồ sơ' }} />
    </Tabs>
  );
}

const createStyles = (theme) => StyleSheet.create({
  tabBarStyle: {
    backgroundColor: theme === 'Halloween' ? Colors.BLACK : Colors.WHITE,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: 70,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  myTripIconContainer: {
    backgroundColor: theme === 'Halloween' ? Colors.HALLOWEEN : Colors.PRIMARY,
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  myTripIconFocused: {
    backgroundColor: theme === 'Halloween' ? Colors.HALLOWEEN : Colors.PRIMARY,
  },
});
