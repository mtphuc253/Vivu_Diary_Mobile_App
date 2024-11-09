import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, Modal, TouchableOpacity, ScrollView, StyleSheet, ImageBackground } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useRoute } from '@react-navigation/native';
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TripDetail() {
  const route = useRoute();
  const { trip } = route.params;

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [theme, setTheme] = useState('default');

  useEffect(() => {
    const fetchTheme = async () => {
      const storedTheme = await AsyncStorage.getItem('@theme');
      setTheme(storedTheme === 'Halloween' ? 'Halloween' : 'default');
    };
    fetchTheme();
  }, []);

  const getRandomImage = (albumImgs) => {
    if (!albumImgs || albumImgs.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * albumImgs.length);
    return albumImgs[randomIndex]?.imgUrl;
  };

  const handleAlbumPress = (album) => {
    setSelectedAlbum(album);
    setModalVisible(true);
  };

  const handleImagePress = (imageUrl) => {
    console.log('Image pressed:', imageUrl);
  };

  const backgroundImageSource = theme === 'Halloween'
    ? require('../../assets/images/themes/DARK_BG.png')
    : require('../../assets/images/createTrip.png');

  const styles = createStyles(theme);

  return (
    <ImageBackground source={backgroundImageSource} style={styles.backgroundImage}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Image source={{ uri: trip.tripAvt }} style={styles.tripImage} />
          <View style={styles.tripInfoContainer}>
            <Text style={styles.tripName}>{trip.tripName}</Text>
            <Text style={styles.tripPlace}>{trip.tripPlace}</Text>
          </View>
        </View>

        {/* Albums Section */}
        <FlatList
          data={trip.albums || []}
          ListHeaderComponent={() => (
            <View style={styles.albumHeaderContainer}>
              <Text style={styles.albumHeader}>Album về {trip.tripName}</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleAlbumPress(item)}>
              <View style={styles.albumCard}>
                <View style={styles.albumInfo}>
                  <Text style={styles.albumName}>
                    <MaterialIcons name="place" size={14} color={theme === 'Halloween' ? Colors.HALLOWEEN : Colors.PRIMARY} /> {item.albumName}
                  </Text>
                  <Text style={styles.albumStatus} numberOfLines={2} ellipsizeMode="tail">
                    {item.albumStatus}
                  </Text>
                </View>
                <Image source={{ uri: getRandomImage(item.albumImgs) }} style={styles.albumImage} />
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />

        {/* Album Modal */}
        <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <Entypo name="cross" size={24} color="grey" />
              </TouchableOpacity>
              <Text style={styles.modalAlbumName}>{selectedAlbum?.albumName}</Text>
              <Text style={styles.modalAlbumStatus}>{selectedAlbum?.albumStatus}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {selectedAlbum?.albumImgs.map((img, index) => (
                  <TouchableOpacity key={index} onPress={() => handleImagePress(img.imgUrl)}>
                    <Image source={{ uri: img.imgUrl }} style={styles.modalImage} />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        <View style={{ height: 50 }} />
      </View>
    </ImageBackground>
  );
}

const createStyles = (theme) => StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    // backgroundColor: theme === 'Halloween' ? Colors.BLACK : '#ededed',
  },
  header: {
    width: '100%',
    height: 250,
    position: 'relative',
    marginBottom: 20,
  },
  tripImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  tripInfoContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: theme === 'Halloween' ? Colors.PURPLE : Colors.WHITE,
    padding: 20,
    borderRadius: 15,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tripName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme === 'Halloween' ? Colors.HALLOWEEN : Colors.BLACK,
    marginBottom: 5,
  },
  tripPlace: {
    fontSize: 14,
    color: theme === 'Halloween' ? Colors.LIGHT_ORANGE : '#555',
    textAlign: 'left',
  },
  albumHeaderContainer: {
    padding: 20,
  },
  albumHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 5,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#ededed',
    color: theme === 'Halloween' ? Colors.PURPLE : Colors.BLACK,
  },
  albumCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 0.5,
    borderColor: '#ededed',
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  albumInfo: {
    flex: 1,
  },
  albumName: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
    color: theme === 'Halloween' ? Colors.PURPLE : Colors.BLACK,
  },
  albumStatus: {
    fontSize: 16,
    color: theme === 'Halloween' ? Colors.PURPLE : Colors.GREY,
  },
  albumImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '95%',
    padding: 20,
    backgroundColor: theme === 'Halloween' ? Colors.BLACK : '#fff',
    borderRadius: 10,
    paddingBottom: 80,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  modalAlbumName: {
    fontWeight: 'bold',
    fontSize: 28,
    marginBottom: 20,
    color: theme === 'Halloween' ? Colors.HALLOWEEN : Colors.BLACK,
  },
  modalAlbumStatus: {
    fontSize: 16,
    color: theme === 'Halloween' ? Colors.LIGHT_ORANGE : Colors.GREY,
    marginBottom: 40,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#EDEDED',
  },
  modalImage: {
    width: 280,
    height: 280,
    borderRadius: 10,
    marginRight: 10,
  },
});
