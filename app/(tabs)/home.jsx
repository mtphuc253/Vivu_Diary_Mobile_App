import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../../configs/FirebaseConfig';
import { Colors } from '../../constants/Colors';

export default function Home() {
    const [userTrips, setUserTrips] = useState([]);
    const [uniqueName, setUniqueName] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
        const fetchUserData = async () => {
            const name = await AsyncStorage.getItem('@uniqueName');
            const email = await AsyncStorage.getItem('@userEmail');
            setUniqueName(name || 'User'); // Default to 'User' if name is not available
            fetchUserTrips(email);
        };

        const fetchUserTrips = async (email) => {
            try {
                const tripsQuery = query(
                    collection(db, 'DiaryTrips'),
                    where('userEmail', '==', email)
                );
                const querySnapshot = await getDocs(tripsQuery);
                const trips = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setUserTrips(trips);
            } catch (error) {
                console.error('Error fetching trips:', error);
            }
        };

        fetchUserData();
    }, []);

    return (
        <ImageBackground
            source={require('../../assets/images/1.png')}
            style={styles.backgroundImage}
        >
            <View style={styles.container}>
                <View style={styles.tripContent}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Chuyến đi gần nhất</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('mytrip')}>
                            <Text style={styles.viewAllText}>Xem tất cả</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Trip Cards */}
                    <FlatList
                        data={userTrips}
                        keyExtractor={(item) => item.id}
                        horizontal
                        contentContainerStyle={styles.tripList}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.tripCard}
                                onPress={() => navigation.navigate('detail-trip/trip-detail', { trip: item.tripData })}
                            >
                                <Image source={{ uri: item.tripData.tripAvt }} style={styles.tripImage} />
                                <View style={{paddingHorizontal: 15, marginTop: 8}}>
                                    <Text style={styles.tripName}>{item.tripData.tripName}</Text>
                                    <Text style={styles.tripPlace}>{item.tripData.tripPlace}</Text>
                                </View>

                            </TouchableOpacity>
                        )}
                        ListEmptyComponent={
                            <Text style={styles.noTripsText}>No trips available</Text>
                        }
                    />
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        // resizeMode: 'contain',
        justifyContent: 'space-between',
        marginBottom: 40
    },
    container: {
        flex: 1,
        paddingTop: 80,
        paddingHorizontal: 20,
        // justifyContent: 'flex-end',
    },
    tripContent: {
        position: "absolute",
        bottom: 40,
        left: 20
        // paddingHorizontal: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.BLACK,
    },
    viewAllText: {
        fontSize: 16,
        color: Colors.GREY,
        fontStyle: 'italic'
    },
    tripList: {
        paddingHorizontal: 10,
        paddingBottom: 30,
    },
    tripCard: {
        backgroundColor: "#fffdf4",
        borderTopLeftRadius: 7,
        borderTopRightRadius: 7,
        borderBottomRightRadius: 7,
        borderBottomLeftRadius: 45,
        padding: 8,
        width: 240,
        height: 360,
        marginRight: 15,
        elevation: 2,
    },
    tripImage: {
        width: '100%',
        height: 200,
        borderTopLeftRadius: 7,
        borderTopRightRadius: 7,
        borderBottomRightRadius: 7,
        borderBottomLeftRadius: 45,
        marginBottom: 10,
    },
    tripName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.PRIMARY,
        marginBottom: 3
    },
    tripPlace: {
        fontSize: 15,
        color: Colors.GREY,
    },
    noTripsText: {
        fontSize: 16,
        color: Colors.GREY,
    },
});
