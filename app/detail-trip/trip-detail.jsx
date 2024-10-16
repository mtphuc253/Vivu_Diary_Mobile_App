import React, { useState } from 'react';
import { View, Text, Image, FlatList, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useRoute } from '@react-navigation/native';
import { Entypo, MaterialIcons } from '@expo/vector-icons';

export default function TripDetail() {
  const route = useRoute();
  const { trip } = route.params;

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);

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

  return (
    <View style={{ flex: 1, backgroundColor: '#ededed' }}>
      {/* Header */}
      <View style={{
        width: '100%',
        height: 250,
        position: 'relative',
        marginBottom: 20,
      }}>
        <Image
          source={{ uri: trip.tripAvt }}
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
          }}
        />
        <View style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          backgroundColor: 'white',
          padding: 20,
          borderRadius: 15,
          alignItems: 'flex-start',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}>
          <Text style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: '#000',
            marginBottom: 5,
          }}>{trip.tripName}</Text>
          <Text style={{
            fontSize: 14,
            color: '#555',
            textAlign: 'left',
          }}>{trip.tripPlace}</Text>
        </View>
      </View>

      {/* Albums Section */}
      <FlatList
        data={trip.albums || []}
        ListHeaderComponent={() => (
          <View style={{ padding: 20 }}>
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              marginBottom: 10,
              marginLeft: 5,
              paddingBottom: 10,
              borderBottomWidth: 1,
              borderColor: "#ededed"
            }}>Album về {trip.tripName}</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleAlbumPress(item)}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 20,
              borderBottomWidth: 0.5,
              borderColor: "#ededed",
              paddingBottom: 15,
              paddingHorizontal: 20
            }}>
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontWeight: 'bold',
                  fontSize: 18,
                  marginBottom: 5,
                }}><MaterialIcons name="place" size={14} color={Colors.PRIMARY} />{item.albumName}</Text>
                <Text style={{
                  fontSize: 16,
                  color: Colors.GREY,
                }}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {item.albumStatus}
                </Text>
              </View>
              <Image
                source={{ uri: getRandomImage(item.albumImgs) }}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 10,
                }}
              />
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />

      {/* Modal for album details */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}>
          <View style={{
            width: '95%',
            height: 'auto',
            padding: 20,
            backgroundColor: '#fff',
            borderRadius: 10,
            paddingBottom: 80,
          }}>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={{
              alignSelf: 'flex-end',
              marginBottom: 10,
            }}>
              <Entypo name="cross" size={24} color="grey" />
            </TouchableOpacity>
            <Text style={{
              fontWeight: 'bold',
              fontSize: 28,
              marginBottom: 20,
            }}>{selectedAlbum?.albumName}</Text>
            <Text style={{
              fontSize: 16,
              color: Colors.GREY,
              marginBottom: 40,
              paddingBottom: 10,
              borderBottomWidth: 1,
              borderColor: "#EDEDED"
            }}>{selectedAlbum?.albumStatus}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {selectedAlbum?.albumImgs.map((img, index) => (
                <TouchableOpacity key={index} onPress={() => handleImagePress(img.imgUrl)}>
                  <Image source={{ uri: img.imgUrl }} style={{
                    width: 280,
                    height: 280,
                    borderRadius: 10,
                    marginRight: 10,
                  }} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Empty space at bottom */}
      <View style={{ height: 50 }} />
    </View>
  );
}
