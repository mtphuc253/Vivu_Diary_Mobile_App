import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { CreateTripContext } from '../../context/CreateTripContext';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../configs/ImageFirebaseConfig';
import * as FileSystem from 'expo-file-system';

export default function CreateAlbum() {
    const { tripData, setTripData } = useContext(CreateTripContext);
    const navigation = useNavigation();

    const [albumName, setAlbumName] = useState('');
    const [albumStatus, setAlbumStatus] = useState('');
    const [albumImgs, setAlbumImgs] = useState([]); // To store URLs after upload
    const [pickedImgs, setPickedImgs] = useState([]); // Local URIs of picked images
    const [uploading, setUploading] = useState(false); // Loading state

    // Pick images from library
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            selectionLimit: 4, // max 4 images
        });

        if (!result.canceled) {
            setPickedImgs(prevImgs => [...prevImgs, ...result.assets.map(asset => asset.uri)]);
        }
    };

    // Upload image to Firebase and return the URL
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

        // Upload to Firebase Storage
        await uploadBytes(storageRef, blob);

        // Get the URL of the uploaded image
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
    };

    // Handle uploading all picked images
    const handleUploadImages = async () => {
        setUploading(true); // Start loading

        try {
            // Upload each image and get their URLs
            const uploadedImgUrls = await Promise.all(
                pickedImgs.map(async (imgUri) => {
                    const url = await uploadImage(imgUri);
                    return url;
                })
            );

            // After successful upload, store the URLs in albumImgs
            setAlbumImgs(uploadedImgUrls);

        } catch (error) {
            console.error("Error uploading images: ", error);
        } finally {
            setUploading(false); // Stop loading
        }
    };

    // Handle creating album with uploaded images
    const handleCreateAlbum = () => {
        if (albumImgs.length === 0) {
            console.error("No images uploaded.");
            return;
        }

        const newAlbum = {
            albumId: new Date().toISOString(),
            albumName: albumName,
            albumStatus: albumStatus,
            albumImgs: albumImgs.map((url) => ({ imgUrl: url })), // Use URLs from Firebase
        };

        // Update tripData with the new album
        const updatedTripData = {
            ...tripData,
            albums: [...(tripData.albums || []), newAlbum],
        };

        setTripData(updatedTripData);
        // console.log("Album created:", updatedTripData);
        // console.log("Updated tripData:", JSON.stringify(updatedTripData, null, 2));

        // Optional: Navigate back after successful creation
        navigation.goBack();
    };

    // Remove a picked image
    const removeImage = (index) => {
        setPickedImgs(pickedImgs.filter((_, i) => i !== index));
    };

    return (
        <ScrollView contentContainerStyle={{ padding: 20 }}>
            <Text>Tên Album</Text>
            <TextInput
                value={albumName}
                onChangeText={setAlbumName}
                placeholder="Nhập tên album"
                style={{ borderColor: '#ddd', borderWidth: 1, padding: 10, marginBottom: 20 }}
            />

            <Text>Trạng thái Album</Text>
            <TextInput
                value={albumStatus}
                onChangeText={setAlbumStatus}
                placeholder="Nhập trạng thái album"
                multiline
                numberOfLines={4}
                style={{ borderColor: '#ddd', borderWidth: 1, padding: 10, marginBottom: 20 }}
            />

            <TouchableOpacity onPress={pickImage} style={{ marginBottom: 20, backgroundColor: '#007BFF', padding: 15 }}>
                <Text style={{ color: '#fff', textAlign: 'center' }}>Chọn hình ảnh</Text>
            </TouchableOpacity>

            <ScrollView horizontal style={{ flexDirection: 'row', marginBottom: 20 }}>
                {pickedImgs.map((img, index) => (
                    <View key={index} style={{ position: 'relative', marginRight: 10 }}>
                        <Image 
                            source={{ uri: img }}
                            style={{ width: 100, height: 100 }}
                        />
                        {/* X button to remove image */}
                        <TouchableOpacity
                            style={{
                                position: 'absolute',
                                top: -10,
                                right: -10,
                                backgroundColor: 'red',
                                borderRadius: 10,
                                width: 20,
                                height: 20,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                            onPress={() => removeImage(index)}
                        >
                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>X</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>

            {/* Show Upload button if images are picked */}
            {pickedImgs.length > 0 && (
                <Button
                    title={uploading ? "Đang tải..." : "Đăng tải hình ảnh"}
                    onPress={handleUploadImages}
                    disabled={uploading}
                    style={{ marginBottom: 20 }}
                />
            )}

            {/* Show Create Album button only if images have been uploaded */}
            {albumImgs.length > 0 && (
                <Button title="Tạo Album" onPress={handleCreateAlbum} disabled={uploading} />
            )}
        </ScrollView>
    );
}
