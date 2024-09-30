import { Tabs } from 'expo-router';
import React from 'react';
import { FontAwesome, MaterialIcons, AntDesign, FontAwesome6, Ionicons } from '@expo/vector-icons'; // Import các icon cần dùng
import { Colors } from '../../constants/Colors';

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          // Kiểm tra route.name để hiển thị icon tương ứng
          if (route.name === 'mytrip') {
            return <Ionicons name="airplane-outline" size={24} color={color}/>
          } else if (route.name === 'discovery') {
            return <Ionicons name="search-outline" size={24} color={color} />
          } else if (route.name === 'profile') {
            return <AntDesign name="user" size={24} color={color} />;
          }
        },
        tabBarActiveTintColor: Colors.PRIMARY,
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tabs.Screen name="mytrip" options={{ title: 'My Trip' }} />
      <Tabs.Screen name="discovery" options={{ title: 'Discovery' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
