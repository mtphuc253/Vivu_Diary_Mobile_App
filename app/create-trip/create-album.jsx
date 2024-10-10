import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, ScrollView, Image, TouchableOpacity, ActivityIndicator, ToastAndroid } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { CreateTripContext } from '../../context/CreateTripContext';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../configs/ImageFirebaseConfig';
import * as FileSystem from 'expo-file-system';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

export default function CreateAlbum() {
    const { tripData, setTripData } = useContext(CreateTripContext);
    const navigation = useNavigation();

    const [albumName, setAlbumName] = useState('');
    const [albumStatus, setAlbumStatus] = useState('');
    const [albumImgs, setAlbumImgs] = useState([]);
    const [pickedImgs, setPickedImgs] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false); // Track if upload is completed

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            selectionLimit: 4,
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

    return (
        <View style={{ flex: 1, marginTop: 20 }}>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, backgroundColor: '#f8f8f8', borderBottomWidth: 1, borderColor: '#ddd' }}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 15 }}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center', flex: 1 }}>Album của bạn</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20 }}>
                <Text
                    style={{
                        fontWeight: 700,
                        fontSize: 16,
                        marginBottom: 5,
                    }}
                >Tên Album</Text>
                <TextInput
                    value={albumName}
                    onChangeText={setAlbumName}
                    placeholder="Nhập tên album"
                    style={{ borderColor: '#ddd', borderWidth: 1, padding: 10, marginBottom: 20, borderRadius: 8 }}
                />

                <Text
                    style={{
                        fontWeight: 700,
                        fontSize: 16,
                        marginBottom: 5,
                    }}
                >Cảm nhận của bạn</Text>
                <TextInput
                    value={albumStatus}
                    onChangeText={setAlbumStatus}
                    placeholder="Bạn cảm thấy thế nào"
                    multiline={true}
                    numberOfLines={10}
                    style={{ borderColor: '#ddd', borderWidth: 1, padding: 10, marginBottom: 20, borderRadius: 8, minHeight: 100, textAlignVertical: "top" }}
                />

                <TouchableOpacity onPress={pickImage} style={{ marginBottom: 5, backgroundColor: '#007BFF', padding: 15, borderRadius: 8, backgroundColor: Colors.PRIMARY, marginTop: 40 }}>
                    <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 700, fontSize: 16 }}>Chọn ảnh</Text>
                </TouchableOpacity>

                <ScrollView horizontal style={{ flexDirection: 'row', marginBottom: 20 }}>
                    {pickedImgs.map((img, index) => (
                        <View key={index} style={{ position: 'relative', marginRight: 10 }}>
                            <Image
                                source={{ uri: img }}
                                style={{ width: 100, height: 100, marginTop: 5 }}
                            />
                            <TouchableOpacity
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    right: -10,
                                    backgroundColor: Colors.GREY,
                                    borderRadius: 10,
                                    width: 20,
                                    height: 20,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                                onPress={() => removeImage(index)}
                            >
                                <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                                    <Entypo name="cross" size={14} color="white" />
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>

                {/* Show upload button only if images are not uploaded */}
                {!isUploaded && pickedImgs.length > 0 && (
                    <TouchableOpacity
                        onPress={handleUploadImages}
                        style={{
                            borderRadius: 8,
                            backgroundColor: Colors.WHITE,
                            borderWidth: 1,
                            borderColor: Colors.PRIMARY,
                            padding: 15
                        }}
                        disabled={uploading}
                    >
                        <Text style={{ color: Colors.PRIMARY, textAlign: 'center', fontWeight: 'bold' }}>
                            {uploading ? "Đang tải..." : "Đăng tải"}
                        </Text>
                    </TouchableOpacity>
                )}

                {/* Display uploaded images */}
                {albumImgs.length > 0 && (
                    <ScrollView horizontal>
                        {albumImgs.map((img, index) => (
                            <Image
                                key={index}
                                source={{ uri: img }}
                                style={{ width: 100, height: 100, marginRight: 10, marginBottom: 160 }}
                            />
                        ))}
                    </ScrollView>
                )}

                {/* Show create album button after upload */}
                {albumImgs.length > 0 && (
                    <TouchableOpacity
                        onPress={handleCreateAlbum}
                        style={{
                            borderRadius: 8,
                            backgroundColor: Colors.WHITE,
                            borderWidth: 1,
                            borderColor: Colors.PRIMARY,
                            padding: 15
                        }}
                        disabled={uploading}
                    >
                        <Text style={{ color: Colors.PRIMARY, textAlign: 'center', fontWeight: 'bold' }}>
                            Tạo Album
                        </Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </View>
    );
}
