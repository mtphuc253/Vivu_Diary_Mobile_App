import { View, Text, Image, FlatList } from 'react-native';
import React from 'react';
import { Colors } from '../../constants/Colors';
import { useRoute } from '@react-navigation/native'; // Import useRoute để nhận dữ liệu từ navigation

export default function TripDetail() {
  const route = useRoute();
  const { trip } = route.params; // Nhận dữ liệu từ params

  return (
    <View
      style={{
        padding: 25,
        paddingTop: 55,
        backgroundColor: Colors.WHITE,
        height: '100%',
      }}
    >
      {/* Hình ảnh chuyến đi */}
      <Image
        source={{ uri: trip.tripAvt }}
        style={{
          width: '100%',
          height: 250,
          borderRadius: 10,
          marginBottom: 15,
        }}
      />

      {/* Tên chuyến đi */}
      <Text
        style={{
          fontFamily: 'outfitBold',
          fontSize: 22,
          textTransform: 'uppercase',
          marginBottom: 10,
        }}
      >
        {trip.tripName}
      </Text>

      {/* Địa điểm chuyến đi */}
      <Text
        style={{
          fontFamily: 'outfitRegular',
          fontSize: 16,
          color: Colors.GRAY,
          marginBottom: 20,
        }}
      >
        {trip.tripPlace}
      </Text>

      {/* Albums có trong tripData */}
      <FlatList
        data={trip.albums} // Giả sử có trường 'albums' trong tripData
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              marginBottom: 15,
            }}
          >
            <Image
              source={{ uri: item.albumCover }} // Giả sử mỗi album có albumCover
              style={{
                width: '100%',
                height: 150,
                borderRadius: 10,
                marginBottom: 10,
              }}
            />
            <Text
              style={{
                fontFamily: 'outfitRegular',
                fontSize: 16,
                color: Colors.DARK_GRAY,
              }}
            >
              {item.albumName} {/* Tên album */}
            </Text>
          </View>
        )}
      />
    </View>
  );
}
