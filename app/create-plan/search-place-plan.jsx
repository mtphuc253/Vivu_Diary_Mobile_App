import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Text, TextInput, SafeAreaView, FlatList, TouchableOpacity, Platform, Image, Alert, ToastAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import addressData from '../../vn_map_data.json';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { CreateTripContext } from '../../context/CreateTripContext';
import { useRouter } from 'expo-router';

const SearchPlace = () => {
    const [location, setLocation] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [tripName, setTripName] = useState('');

    const navigation = useNavigation();
    const router = useRouter();
    const { planData, setPlanData } = useContext(CreateTripContext);

    const handleLocationChange = (text) => {
        setLocation(text);

        if (text.length > 0) {
            const filteredSuggestions = [];
            addressData.forEach(province => {
                province.District.forEach(district => {
                    const fullAddress = `${district.FullName}, ${province.FullName}`;
                    if (fullAddress.toLowerCase().includes(text.toLowerCase())) {
                        filteredSuggestions.push({
                            district: district.FullName,
                            province: province.FullName
                        });
                    }
                });
            });
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
        }
    };


    const handleSuggestionSelect = (suggestion) => {
        const selectedAddress = `${suggestion.district}, ${suggestion.province}`;
        setLocation(selectedAddress);
        setSuggestions([]);
    };


    const handleClearInput = () => {
        setLocation('');
        setSuggestions([]);
    };

    const handleCreateTrip = () => {
        if (location) {
            setPlanData({
                locationinfor: {
                    name: location
                }

            });
            console.log("planData: ", planData);
            router.push('/create-plan/select-traveler');
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
                <Text style={styles.headerText}>Lên kế hoạch cho chuyến đi mới</Text>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.titleText}>Bạn muốn đi đâu?</Text>
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
                                    <Text style={styles.suggestionText}>{item.district}</Text>
                                    <Text style={styles.suggestionSubText}>{item.province}</Text>
                                </TouchableOpacity>
                            )}
                        />

                    </View>
                )}

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
        backgroundColor: Colors.WHITE,
        borderWidth: 1,
        borderColor: Colors.PRIMARY,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 10,
    },
    imageUploadText: {
        color: Colors.PRIMARY,
        fontWeight: 'bold',
    },
    createButton: {
        backgroundColor: Colors.PRIMARY,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 80,
    },
    createButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    clearImageButton: {
        position: 'absolute',
        left: 140,
        top: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: 15,
        padding: 5,
    },
});

export default SearchPlace;
