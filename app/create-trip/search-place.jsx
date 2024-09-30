import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Text, TextInput, SafeAreaView, FlatList, TouchableOpacity, Platform, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import addressData from '../../vn_map_data.json';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { CreateTripContext } from '../../context/CreateTripContext';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker'; // For image picking
import { storage } from '../../configs/ImageFirebaseConfig';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';

const SearchPlace = () => {
    const [location, setLocation] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [tripName, setTripName] = useState(''); // State for trip name
    const [selectedImage, setSelectedImage] = useState(null); // State for selected image
    const [uploading, setUploading] = useState(false); // State for upload status

    const navigation = useNavigation();
    const router = useRouter();
    const { tripData, setTripData } = useContext(CreateTripContext);

    // useEffect(() => {
    //     console.log(tripData)
    // }, []);

    const handleLocationChange = (text) => {
        setLocation(text);

        if (text.length > 0) {
            const filteredSuggestions = [];
            addressData.forEach(province => {
                province.District.forEach(district => {
                    district.Ward.forEach(ward => {
                        const fullAddress = `${ward.FullName}, ${district.FullName}, ${province.FullName}`;
                        if (fullAddress.toLowerCase().includes(text.toLowerCase())) {
                            filteredSuggestions.push({
                                ward: ward.FullName,
                                district: district.FullName,
                                province: province.FullName
                            });
                        }
                    });
                });
            });
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionSelect = (suggestion) => {
        const selectedAddress = `${suggestion.ward}, ${suggestion.district}, ${suggestion.province}`;
        setLocation(selectedAddress);
        setSuggestions([]);
    };

    const handleClearInput = () => {
        setLocation('');
        setSuggestions([]);
    };

    const pickImage = async () => {
        // Pick image from the gallery
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri); // Show the selected image in UI
        }
    };

    // Chỉnh sửa hàm uploadMedia
    const uploadMedia = async () => {
        setUploading(true);

        try {
            const { uri } = await FileSystem.getInfoAsync(selectedImage);
            const blob = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = () => {
                    resolve(xhr.response);
                };
                xhr.onerror = (e) => {
                    reject(new TypeError('Network request failed'));
                };
                xhr.responseType = 'blob';
                xhr.open('GET', uri, true);
                xhr.send(null);
            });

            const filename = selectedImage.substring(selectedImage.lastIndexOf('/') + 1);
            const storageRef = ref(storage, filename);

            await uploadBytes(storageRef, blob);

            const downloadURL = await getDownloadURL(storageRef);

            setTripData({
                ...tripData,
                tripAvt: downloadURL, 
            });

            Alert.alert('Tải ảnh thành công');
            
        } catch (error) {
            console.error(error);
            Alert.alert('Lỗi tải ảnh');
        } finally {
            setUploading(false);
        }
    };


    const clearSelectedImage = () => {
        setSelectedImage(null);
    };

    const handleCreateTrip = () => {
        if (tripName && location && tripData.tripAvt) {
            setTripData({
                ...tripData,
                tripName: tripName,
                tripPlace: location
            });
            console.log(tripData); // Log tripData for debugging
            router.push('/create-trip/select-travel');
            // You can now navigate or do any further actions needed.
        } else {
            alert('Vui lòng cung cấp đầy đủ thông tin');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Viết về chuyến đi của bạn</Text>
            </View>

            <View style={styles.inputContainer}>
                {/* Input for Trip Name */}
                <Text style={styles.titleText}>Tên chuyến đi của bạn</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Nhập tên chuyến đi"
                    value={tripName}
                    onChangeText={setTripName}
                />

                <Text style={styles.titleText}>Bạn đang đi đâu?</Text>
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Đà Lạt, Đà Nẵng, Hà Nội..."
                        value={location}
                        onChangeText={handleLocationChange}
                        autoCompleteType="street-address"
                        autoCorrect={false}
                    />
                    {location.length > 0 && (
                        <TouchableOpacity style={styles.clearButton} onPress={handleClearInput}>
                            <Entypo name="circle-with-cross" size={18} color="grey" />
                        </TouchableOpacity>
                    )}
                </View>

                {suggestions.length > 0 && (
                    <View style={styles.suggestionsContainer}>
                        <FlatList
                            data={suggestions}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.suggestionItem} onPress={() => handleSuggestionSelect(item)}>
                                    <Text style={styles.suggestionText}>{item.ward}</Text>
                                    <Text style={styles.suggestionSubText}>{item.district}, {item.province}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                )}

                <TouchableOpacity style={styles.imageUploadButton} onPress={pickImage}>
                    <Text style={styles.imageUploadText}>Chọn hình ảnh cho chuyến đi</Text>
                </TouchableOpacity>
                <View>
                    {selectedImage && (
                        <View style={{ position: 'relative' }}>
                            <Image
                                source={{ uri: selectedImage }}
                                style={{ width: 300, height: 300 }}
                            />
                            <TouchableOpacity style={styles.clearImageButton} onPress={clearSelectedImage}>
                                <Entypo name="circle-with-cross" size={24} color={Colors.PRIMARY} />
                            </TouchableOpacity>
                        </View>
                    )}

                    {uploading ? (
                        <Text>Đang tải lên...</Text>
                    ) : (
                        selectedImage && (
                            <TouchableOpacity style={styles.imageUploadButton} onPress={uploadMedia}>
                                <Text style={styles.imageUploadText}>Đăng tải</Text>
                            </TouchableOpacity>
                        )
                    )}
                </View>

                <TouchableOpacity style={styles.createButton} onPress={handleCreateTrip}>
                    <Text style={styles.createButtonText}>Tạo</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.emptySpace}></View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? 30 : 0,
    },
    header: {
        backgroundColor: Colors.WHITE,
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        position: 'absolute',
        left: 10,
        padding: 5,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        flex: 1,
    },
    titleText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 10,
        fontFamily: 'outfitBold'
    },
    inputContainer: {
        paddingHorizontal: 20,
        marginTop: 30,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textInput: {
        width: '100%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        fontSize: 16,
        marginBottom: 25
    },
    clearButton: {
        position: 'absolute',
        right: 10,
        top: "25%"
    },
    suggestionsContainer: {
        backgroundColor: Colors.WHITE,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginTop: 10,
        padding: 10,
        maxHeight: 250,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    suggestionItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    suggestionText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    suggestionSubText: {
        fontSize: 14,
        color: '#555',
    },
    emptySpace: {
        flex: 1,
    },
    imageUploadButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 10,
    },
    imageUploadText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    createButton: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    createButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    clearImageButton: {
        position: 'absolute',
        right: 5,
        top: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: 15,
        padding: 5,
    },
});

export default SearchPlace;
