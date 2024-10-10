import { Tabs } from 'expo-router';
import React from 'react';
import { FontAwesome, MaterialIcons, AntDesign, FontAwesome6, Ionicons } from '@expo/vector-icons'; // Import các icon cần dùng
import { View, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';

export default function TabLayout() {
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
          } else if (route.name === 'profile') {
            return <AntDesign name="user" size={24} color={color} />;
          }
        },
        tabBarStyle: styles.tabBarStyle,
        tabBarItemStyle: { paddingBottom: 10 },
        tabBarActiveTintColor: Colors.PRIMARY,
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tabs.Screen name="discovery" options={{ title: 'Discovery' }} />
      <Tabs.Screen name="mytrip" options={{ title: 'My Trip' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: Colors.WHITE,
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
    backgroundColor: Colors.PRIMARY,
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
    backgroundColor: Colors.PRIMARY,
  },
});
