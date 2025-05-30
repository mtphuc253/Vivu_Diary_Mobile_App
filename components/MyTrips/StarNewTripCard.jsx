import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Entypo } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function StarNewTripCard() {
  const router = useRouter();
  const [theme, setTheme] = useState('default');

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('@theme');
        setTheme(storedTheme === 'Halloween' ? 'Halloween' : 'default');
      } catch (error) {
        console.error("Error fetching theme from AsyncStorage:", error);
      }
    };

    fetchTheme();
  }, []);

  return (
    <View
      style={{
        padding: 20,
        marginTop: 50,
        display: 'flex',
        alignItems: 'center',
        gap: 20,
      }}
    >
      <Entypo
        name="location-pin"
        size={36}
        color={theme === 'Halloween' ? Colors.PURPLE : Colors.BLACK}
      />
      <Text
        style={{
          fontSize: 25,
          fontFamily: 'outfitSemibold',
          color: theme === 'Halloween' ? Colors.PURPLE : Colors.BLACK,
        }}
      >
        Không có chuyến đi
      </Text>
      <Text
        style={{
          fontSize: 18,
          fontFamily: 'outfitMedium',
          textAlign: 'center',
          color: theme === 'Halloween' ? Colors.PURPLE : Colors.GREY,
        }}
      >
        Có vẻ bạn chưa có chuyến đi nào.
        Hãy bắt đầu tạo chuyến đi mới của bạn
      </Text>

      <TouchableOpacity
        onPress={() => router.push('/create-trip/search-place')}
        style={{
          padding: 10,
          backgroundColor: theme === 'Halloween' ? Colors.PURPLE : Colors.PRIMARY,
          borderRadius: 10,
          paddingHorizontal: 60,
          paddingVertical: 14,
          marginTop: 40,
        }}
      >
        <Text
          style={{
            fontSize: 17,
            fontFamily: 'outfitSemibold',
            color: Colors.WHITE,
          }}
        >
          Tạo chuyến đi
        </Text>
      </TouchableOpacity>
    </View>
  );
}
