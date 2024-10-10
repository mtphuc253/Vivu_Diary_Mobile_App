import React, { useContext, useState } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Colors } from '../../constants/Colors';
import { CreateTripContext } from '../../context/CreateTripContext';
import { useRouter } from 'expo-router';
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "../../configs/FirebaseConfig";

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

    const handleCreateTrip = async () => {
        const user = auth.currentUser;

        if (user) {
            try {
                const docId=(Date.now()).toString();
                await setDoc(doc(db, "DiaryTrips", docId), {
                    userEmail: user.email,
                    tripData: tripData,
                });
                router.push('(tabs)/mytrip')
                console.log("Chuyến đi đã được lưu thành công!");
            } catch (error) {
                console.error("Error saving trip:", error);
            }
        } else {
            console.error("Không tìm thấy người dùng đã đăng nhập");
        }
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

            <View style={styles.albumSection}>
                <Text style={styles.albumHeader}>Album về {tripData.tripName}</Text>
                <ScrollView contentContainerStyle={{ padding: 0 }}>
                    {tripData.albums && tripData.albums.length > 0 ? (
                        tripData.albums.map((album, index) => (
                            <TouchableOpacity key={index} style={styles.albumCard} onPress={() => handleAlbumPress(album)}>

                                <View style={styles.albumInfo}>
                                    <Text style={styles.albumName}><MaterialIcons name="place" size={14} color={Colors.PRIMARY} />{album.albumName}</Text>
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
                        <Text style={styles.noAlbum}>Chưa có album nào</Text>
                    )}

                </ScrollView>
                <TouchableOpacity style={styles.addButton} onPress={handleAddAlbum}>
                    <Text style={styles.addButtonText}>Thêm</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.addButton} onPress={handleCreateTrip}>
                <Text style={styles.addButtonText}>Tạo chuyến đi</Text>
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>
                                <Entypo name="cross" size={16} color="grey" />
                            </Text>
                        </TouchableOpacity>
                        <Text style={styles.albumNameModal}>{selectedAlbum?.albumName}</Text>
                        <Text style={styles.albumStatusModal}>{selectedAlbum?.albumStatus}</Text>
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

            <Modal
                visible={imageViewVisible}
                animationType="fade"
                onRequestClose={() => setImageViewVisible(false)}
            >
                <View style={styles.imageViewContainer}>
                    <TouchableOpacity onPress={() => setImageViewVisible(false)} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}><Entypo name="cross" size={16} color="grey" style={{ marginTop: 40 }} /></Text>
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
        backgroundColor: '#ededed',
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
        paddingVertical: 20,
        marginTop: 60,
        minHeight: 280,
        maxHeight: 460,
        backgroundColor: Colors.WHITE
    },
    albumHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        marginLeft: 5,
        marginBottom: 30,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderColor: "#ededed"
    },
    addButton: {
        backgroundColor: Colors.PRIMARY,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
        marginHorizontal: 20
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    albumCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        borderBottomWidth: 0.5,
        borderColor: "#ededed",
        paddingBottom: 15
    },
    albumInfo: {
        flex: 1,
        marginRight: 10,
    },
    albumName: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 20,
    },
    albumNameModal: {
        fontWeight: 'bold',
        fontSize: 28,
        marginBottom: 20,
    },
    albumStatus: {
        fontSize: 16,
        color: Colors.GREY,
        marginBottom: 20,

    },

    albumStatusModal: {
        fontSize: 16,
        color: Colors.GREY,
        marginBottom: 40,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderColor: "#EDEDED"
    },
    albumImage: {
        width: 60,
        height: 60,
        borderRadius: 10,
    },
    albumOrderTag: {
        position: 'absolute',
        top: -10,
        left: -10,
        backgroundColor: '#FF6347',
        borderRadius: 10,
        padding: 5,
        zIndex: 1,
    },
    albumOrderText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    noAlbum: {
        color: Colors.GREY,
        fontSize: 16,
        fontStyle: 'italic',
        textAlign: 'center',
        paddingVertical: 100
        // marginLeft: 30,
        // marginTop: 10
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '95%',
        height: 'auto',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingBottom: 80,
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
        width: 280,
        height: 280,
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
