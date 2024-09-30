import React, { useContext, useState } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Colors } from '../../constants/Colors';
import { CreateTripContext } from '../../context/CreateTripContext';
import { useRouter } from 'expo-router';

const SelectTravel = () => {
    const { tripData } = useContext(CreateTripContext);
    const router = useRouter();

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [imageViewVisible, setImageViewVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const getRandomImage = (albumImgs) => {
        if (!albumImgs || albumImgs.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * albumImgs.length);
        return albumImgs[randomIndex]?.imgUrl;
    };

    const handleAddAlbum = () => {
        router.push('/create-trip/create-album');
    };

    const handleAlbumPress = (album) => {
        setSelectedAlbum(album);
        setModalVisible(true);
    };

    const handleImagePress = (imageUrl) => {
        setSelectedImage(imageUrl);
        setImageViewVisible(true);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={{ uri: tripData.tripAvt }}
                    style={styles.backgroundImage}
                />
                <View style={styles.overlay}>
                    <View style={styles.tripInfoContainer}>
                        <Text style={styles.tripName}>{tripData.tripName}</Text>
                        <Text style={styles.tripPlace}>{tripData.tripPlace}</Text>
                    </View>
                </View>
            </View>

            {/* Albums section */}
            <View style={styles.albumSection}>
                <Text style={styles.albumHeader}>Album về {tripData.tripName}</Text>
                <ScrollView contentContainerStyle={{ padding: 20 }}>
                    {tripData.albums && tripData.albums.length > 0 ? (
                        tripData.albums.map((album, index) => (
                            <TouchableOpacity key={index} style={styles.albumCard} onPress={() => handleAlbumPress(album)}>
                                <View style={styles.albumInfo}>
                                    <Text style={styles.albumName}>{album.albumName}</Text>
                                    <Text style={styles.albumStatus} numberOfLines={1}>
                                        {album.albumStatus}
                                    </Text>
                                </View>
                                <Image
                                    source={{ uri: getRandomImage(album.albumImgs) }}
                                    style={styles.albumImage}
                                />
                            </TouchableOpacity>
                        ))
                    ) : (
                        <Text>Chưa có album nào</Text>
                    )}
                    {/* Nút Thêm Album Mới */}
                    <TouchableOpacity style={styles.addButton} onPress={handleAddAlbum}>
                        <Text style={styles.addButtonText}>Thêm</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            {/* Modal to show album images */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>X</Text>
                    </TouchableOpacity>
                    <Text style={styles.albumName}>{selectedAlbum?.albumName}</Text>
                    <Text style={styles.albumStatus}>{selectedAlbum?.albumStatus}</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {selectedAlbum?.albumImgs.map((img, index) => (
                            <TouchableOpacity key={index} onPress={() => handleImagePress(img.imgUrl)}>
                                <Image source={{ uri: img.imgUrl }} style={styles.modalImage} />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </Modal>

            {/* Modal to view full image */}
            <Modal
                visible={imageViewVisible}
                animationType="fade"
                onRequestClose={() => setImageViewVisible(false)}
            >
                <View style={styles.imageViewContainer}>
                    <TouchableOpacity onPress={() => setImageViewVisible(false)} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>X</Text>
                    </TouchableOpacity>
                    <Image source={{ uri: selectedImage }} style={styles.fullImage} />
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        width: '100%',
        height: 250,
        position: 'relative',
        marginBottom: 20,
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    tripInfoContainer: {
        position: 'absolute',
        top: 200,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 15,
        width: '90%',
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
        color: '#000',
        textAlign: 'center',
        marginBottom: 5,
    },
    tripPlace: {
        fontSize: 14,
        color: '#555',
        textAlign: 'left',
    },
    albumSection: {
        paddingHorizontal: 20,
        marginTop: 45,
    },
    albumHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        marginLeft: 5,
    },
    addButton: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    albumCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    albumInfo: {
        flex: 1,
        marginRight: 10,
    },
    albumName: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    albumStatus: {
        fontSize: 14,
        color: '#888',
        marginBottom: 10
    },
    albumImage: {
        width: 60,
        height: 60,
        borderRadius: 10,
    },
    modalContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    closeButton: {
        alignSelf: 'flex-end',
        marginBottom: 10,
    },
    closeButtonText: {
        fontSize: 18,
        color: '#FF0000',
    },
    modalImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginRight: 10,
    },
    imageViewContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    fullImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
});

export default SelectTravel;
