import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Image, TouchableOpacity, ActivityIndicator, ToastAndroid, StyleSheet, ImageBackground } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { CreateTripContext } from '../../context/CreateTripContext';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../configs/ImageFirebaseConfig';
import * as FileSystem from 'expo-file-system';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CreateAlbum() {
    const { tripData, setTripData } = useContext(CreateTripContext);
    const navigation = useNavigation();
    const [theme, setTheme] = useState('default');
    const [albumName, setAlbumName] = useState('');
    const [albumStatus, setAlbumStatus] = useState('');
    const [albumImgs, setAlbumImgs] = useState([]);
    const [pickedImgs, setPickedImgs] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);

    useEffect(() => {
        const fetchTheme = async () => {
            const storedTheme = await AsyncStorage.getItem('@theme');
            setTheme(storedTheme === 'Halloween' ? 'Halloween' : 'default');
        };
        fetchTheme();
    }, []);

    const styles = createStyles(theme);

    const pickImage = async () => {
        const isPremium = await AsyncStorage.getItem('@isPremium');
        const selectionLimit = isPremium === 'True' ? 15 : 5;

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            selectionLimit: selectionLimit,
        });

        if (!result.canceled) {
            setPickedImgs(prevImgs => [...prevImgs, ...result.assets.map(asset => asset.uri)]);
        }
    };

    const uploadImage = async (imgUri) => {
        const { uri } = await FileSystem.getInfoAsync(imgUri);
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = () => resolve(xhr.response);
            xhr.onerror = () => reject(new TypeError('Network request failed'));
            xhr.responseType = 'blob';
            xhr.open('GET', uri, true);
            xhr.send(null);
        });

        const filename = imgUri.substring(imgUri.lastIndexOf('/') + 1);
        const storageRef = ref(storage, filename);

        await uploadBytes(storageRef, blob);

        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
    };

    const handleUploadImages = async () => {
        setUploading(true);
        try {
            const uploadedImgUrls = await Promise.all(
                pickedImgs.map(async (imgUri) => {
                    const url = await uploadImage(imgUri);
                    return url;
                })
            );

            setAlbumImgs(uploadedImgUrls);
            setIsUploaded(true);
            setPickedImgs([]);

            ToastAndroid.show('Đăng tải ảnh thành công 🎉', ToastAndroid.LONG);

        } catch (error) {
            console.error("Error uploading images: ", error);
        } finally {
            setUploading(false);
        }
    };

    const handleCreateAlbum = () => {
        if (albumImgs.length === 0) {
            console.error("No images uploaded.");
            return;
        }

        const newAlbum = {
            albumId: new Date().toISOString(),
            albumName: albumName,
            albumStatus: albumStatus,
            albumImgs: albumImgs.map((url) => ({ imgUrl: url })),
        };

        const updatedTripData = {
            ...tripData,
            albums: [...(tripData.albums || []), newAlbum],
        };

        setTripData(updatedTripData);
        navigation.goBack();
    };

    const removeImage = (index) => {
        setPickedImgs(pickedImgs.filter((_, i) => i !== index));
    };

    const backgroundImageSource = theme === 'Halloween'
        ? require('../../../../Project/vivu-diary/assets/images/themes/HALLOWEEN_BG.png')
        : null;

    return (
        <ImageBackground source={backgroundImageSource} style={styles.backgroundImage}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 15 }}>
                        <Ionicons name="arrow-back" size={24} color={Colors.BLACK} />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Album của bạn</Text>
                </View>

                <ScrollView contentContainerStyle={{ padding: 20 }}>
                    <Text style={styles.label}>Tên Album</Text>
                    <TextInput
                        value={albumName}
                        onChangeText={setAlbumName}
                        placeholder="Nhập tên album"
                        placeholderTextColor={Colors.WHITE}
                        style={styles.textInput}
                    />

                    <Text style={styles.label}>Cảm nhận của bạn</Text>
                    <TextInput
                        value={albumStatus}
                        onChangeText={setAlbumStatus}
                        placeholder="Bạn cảm thấy thế nào"
                        placeholderTextColor={Colors.WHITE}
                        multiline={true}
                        numberOfLines={10}
                        style={[styles.textInput, { minHeight: 100, textAlignVertical: "top" }]}
                    />

                    <TouchableOpacity onPress={pickImage} style={styles.button}>
                        <Text style={styles.buttonText}>Chọn ảnh</Text>
                    </TouchableOpacity>

                    <ScrollView horizontal style={styles.imageContainer}>
                        {pickedImgs.map((img, index) => (
                            <View key={index} style={{ position: 'relative', marginRight: 10 }}>
                                <Image source={{ uri: img }} style={styles.pickedImage} />
                                <TouchableOpacity
                                    style={styles.removeButton}
                                    onPress={() => removeImage(index)}
                                >
                                    <Entypo name="cross" size={14} color={Colors.WHITE} />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>

                    {!isUploaded && pickedImgs.length > 0 && (
                        <TouchableOpacity
                            onPress={handleUploadImages}
                            style={styles.uploadButton}
                            disabled={uploading}
                        >
                            <Text style={styles.uploadButtonText}>{uploading ? "Đang tải..." : "Đăng tải"}</Text>
                        </TouchableOpacity>
                    )}

                    {albumImgs.length > 0 && (
                        <ScrollView horizontal>
                            {albumImgs.map((img, index) => (
                                <Image key={index} source={{ uri: img }} style={styles.albumImages} />
                            ))}
                        </ScrollView>
                    )}

                    {albumImgs.length > 0 && (
                        <TouchableOpacity
                            onPress={handleCreateAlbum}
                            style={styles.uploadButton}
                            disabled={uploading}
                        >
                            <Text style={styles.uploadButtonText}>Tạo Album</Text>
                        </TouchableOpacity>
                    )}
                </ScrollView>
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
        marginTop: 20,
        // backgroundColor: theme === 'Halloween' ? Colors.BLACK : Colors.WHITE,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        backgroundColor: theme === 'Halloween' ? 'transparent' : '#f8f8f8',
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        flex: 1,
        // color: theme === 'Halloween' ? Colors.HALLOWEEN : Colors.BLACK,
    },
    label: {
        fontWeight: '700',
        fontSize: 16,
        marginBottom: 5,
        // color: theme === 'Halloween' ? Colors.HALLOWEEN : Colors.BLACK,
    },
    textInput: {
        borderColor: theme === 'Halloween' ? Colors.HALLOWEEN : '#ddd',
        borderWidth: 1,
        padding: 10,
        marginBottom: 20,
        borderRadius: 8,
        backgroundColor: theme === 'Halloween' ? Colors.PURPLE : Colors.WHITE,
        color: theme === 'Halloween' ? Colors.HALLOWEEN : Colors.BLACK,
    },
    button: {
        backgroundColor: theme === 'Halloween' ? Colors.PURPLE : Colors.PRIMARY,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 40,
    },
    buttonText: {
        color: Colors.WHITE,
        textAlign: 'center',
        fontWeight: '700',
        fontSize: 16,
    },
    imageContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    pickedImage: {
        width: 100,
        height: 100,
        marginTop: 5,
    },
    removeButton: {
        position: 'absolute',
        top: 0,
        right: -10,
        backgroundColor: Colors.GREY,
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadButton: {
        borderRadius: 8,
        backgroundColor: theme === 'Halloween' ? Colors.PURPLE : Colors.WHITE,
        borderWidth: 1,
        borderColor: theme === 'Halloween' ? Colors.HALLOWEEN : Colors.PRIMARY,
        padding: 15,
        alignItems: 'center',
    },
    uploadButtonText: {
        color: theme === 'Halloween' ? Colors.HALLOWEEN : Colors.PRIMARY,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    albumImages: {
        width: 100,
        height: 100,
        marginRight: 10,
        marginBottom: 160,
    },
});
