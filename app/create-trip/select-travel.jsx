import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Colors } from '../../constants/Colors';
import { CreateTripContext } from '../../context/CreateTripContext';
import { useRouter } from 'expo-router';
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../configs/FirebaseConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';

const SelectTravel = () => {
    const { tripData } = useContext(CreateTripContext);
    const router = useRouter();
    const [theme, setTheme] = useState('default');

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [imageViewVisible, setImageViewVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [userEmail, setUserEmail] = useState(''); // State để lưu email từ AsyncStorage
    const [uniqueName, setUniqueName] = useState(''); // State để lưu unique_name từ AsyncStorage

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const email = await AsyncStorage.getItem('@userEmail');
                const uniqueName = await AsyncStorage.getItem('@uniqueName');
                if (email) {
                    setUserEmail(email);
                }
                if (uniqueName) {
                    setUniqueName(uniqueName);
                }
            } catch (error) {
                console.error("Error fetching user data from AsyncStorage:", error);
            }
        };

        fetchUserData();
    }, []);

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
        if (userEmail && uniqueName) {
            try {
                const docId = (Date.now()).toString();
                await setDoc(doc(db, "DiaryTrips", docId), {
                    userEmail: userEmail,
                    uniqueName: uniqueName,
                    tripData: tripData,
                });
                router.push('(tabs)/mytrip');
                console.log("Chuyến đi đã được lưu thành công!");
            } catch (error) {
                console.error("Error saving trip:", error);
            }
        } else {
            console.error("Không tìm thấy thông tin người dùng");
        }
    };

    const styles = createStyles(theme);

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
                                    <Text style={styles.albumName}>
                                        <MaterialIcons name="place" size={14} color={Colors.PRIMARY} />
                                        {album.albumName}
                                    </Text>
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

const createStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme === 'Halloween' ? Colors.PURPLE : '#ededed',
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
        backgroundColor: theme === 'Halloween' ? Colors.HALLOWEEN : Colors.WHITE,
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
        textAlign: 'center',
        marginBottom: 5,
        color: theme === 'Halloween' ? Colors.WHITE : Colors.BLACK,
    },
    tripPlace: {
        fontSize: 14,
        color: theme === 'Halloween' ? Colors.WHITE : '#777',
        textAlign: 'left',
    },
    albumSection: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        marginTop: 60,
        minHeight: 280,
        maxHeight: 460,
        backgroundColor: theme === 'Halloween' ? "#532789": Colors.WHITE,
    },
    albumHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme === 'Halloween' ? Colors.HALLOWEEN : Colors.BLACK,
        marginBottom: 10,
        marginLeft: 5,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderColor: theme === 'Halloween' ? Colors.HALLOWEEN : '#ededed',
    },
    addButton: {
        backgroundColor: theme === 'Halloween' ? Colors.HALLOWEEN : Colors.PRIMARY,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
        marginHorizontal: 20,
    },
    addButtonText: {
        color: Colors.WHITE,
        fontWeight: 'bold',
    },
    albumCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        borderBottomWidth: 0.5,
        borderColor: theme === 'Halloween' ? Colors.HALLOWEEN : '#ededed',
        paddingBottom: 15,
    },
    albumInfo: {
        flex: 1,
        marginRight: 10,
    },
    albumName: {
        fontWeight: 'bold',
        fontSize: 18,
        color: theme === 'Halloween' ? Colors.HALLOWEEN : Colors.BLACK,
        marginBottom: 20,
    },
    albumNameModal: {
        fontWeight: 'bold',
        fontSize: 28,
        color: theme === 'Halloween' ? Colors.HALLOWEEN : Colors.BLACK,
        marginBottom: 20,
    },
    albumStatus: {
        fontSize: 16,
        color: theme === 'Halloween' ? Colors.LIGHT_ORANGE : Colors.LIGHT_GREY,
        marginBottom: 20,
    },
    albumStatusModal: {
        fontSize: 16,
        color: theme === 'Halloween' ? Colors.LIGHT_ORANGE : Colors.GREY,
        marginBottom: 40,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderColor: theme === 'Halloween' ? Colors.HALLOWEEN : '#EDEDED',
    },
    albumImage: {
        width: 60,
        height: 60,
        borderRadius: 10,
    },
    noAlbum: {
        color: theme === 'Halloween' ? Colors.LIGHT_GREY : Colors.GREY,
        fontSize: 16,
        fontStyle: 'italic',
        textAlign: 'center',
        paddingVertical: 100,
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
        backgroundColor: theme === 'Halloween' ? Colors.PURPLE : Colors.WHITE,
        borderRadius: 10,
        paddingBottom: 80,
    },
    closeButton: {
        alignSelf: 'flex-end',
        marginBottom: 10,
    },
    closeButtonText: {
        fontSize: 18,
        color: theme === 'Halloween' ? Colors.HALLOWEEN : '#FF0000',
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
        backgroundColor: Colors.BLACK,
    },
    fullImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
});


export default SelectTravel;
