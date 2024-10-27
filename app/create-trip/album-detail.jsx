import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../constants/Colors';

export default function AlbumDetail({ route }) {
  const { tripName, tripPlace, album } = route.params;
  const [showFullStatus, setShowFullStatus] = useState(false);
  const [theme, setTheme] = useState('default');

  const toggleStatusView = () => {
    setShowFullStatus(!showFullStatus);
  };

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

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.tripName}>{tripName}</Text>
      <Text style={styles.tripPlace}>{tripPlace}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {album.albumImgs.map((img, index) => (
          <Image key={index} source={{ uri: img.imgUrl }} style={styles.albumImage} />
        ))}
      </ScrollView>
      <View style={styles.statusContainer}>
        <Text style={styles.albumStatus} numberOfLines={showFullStatus ? undefined : 2}>
          {album.albumStatus}
        </Text>
        <TouchableOpacity onPress={toggleStatusView}>
          <Text style={styles.toggleButton}>
            {showFullStatus ? 'Rút gọn' : 'Xem thêm'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: theme === 'Halloween' ? Colors.BLACK : '#fff',
  },
  tripName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: theme === 'Halloween' ? Colors.HALLOWEEN : Colors.BLACK,
  },
  tripPlace: {
    fontSize: 16,
    color: theme === 'Halloween' ? Colors.LIGHT_ORANGE : '#777',
    marginBottom: 20,
  },
  albumImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  statusContainer: {
    marginTop: 20,
  },
  albumStatus: {
    fontSize: 14,
    color: theme === 'Halloween' ? Colors.LIGHT_GREY : '#555',
  },
  toggleButton: {
    color: theme === 'Halloween' ? Colors.HALLOWEEN : '#007BFF',
    marginTop: 6,
  },
});
