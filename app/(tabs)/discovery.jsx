import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors } from '../../constants/Colors';
import { db } from '../../configs/FirebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { Searchbar } from 'react-native-paper';

export default function Discovery() {
  const [allTrips, setAllTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation(); // Initialize navigation

  useEffect(() => {
    const fetchAllTrips = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'DiaryTrips'));
        const trips = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAllTrips(trips);
      } catch (error) {
        console.error('Error fetching trips: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllTrips();
  }, []);

  const handleSearch = query => {
    setSearchQuery(query);
  };

  // Filter trips based on the search query
  const filteredTrips = allTrips.filter(trip => {
    const userName = trip.userEmail.split('@')[0]; // Get the user name before '@'
    return userName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (loading) {
    return <ActivityIndicator size="large" color={Colors.PRIMARY} />;
  }

  const renderTrip = ({ item }) => {
    const trip = item.tripData; // Assuming tripData contains the trip details
    const userName = item.userEmail.split('@')[0]; // Get the user name
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('detail-trip/trip-detail', { trip })} // Navigate to trip detail
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <View
            style={{
              backgroundColor: Colors.PRIMARY,
              borderRadius: 50,
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 10,
            }}
          >
            <Text style={{ color: Colors.WHITE, fontSize: 18 }}>
              {userName.charAt(0).toUpperCase()} {/* Display the first character of the user name */}
            </Text>
          </View>
          <Text style={{ fontFamily: 'outfitBold', fontSize: 16, color: Colors.BLACK }}>
            {userName} {/* Display user's name */}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: Colors.WHITE,
            padding: 15,
            paddingTop: 0,
            borderWidth: 1,
            borderColor: '#EDEDED',
            borderRadius: 15,
            marginBottom: 20,
          }}
        >
          <Image
            source={{ uri: trip.tripAvt }}
            style={{
              width: '100%',
              height: 200,
              borderRadius: 10,
              marginBottom: 15,
              marginTop: 15
            }}
          />

          <Text
            style={{
              fontFamily: 'outfitBold',
              fontSize: 22,
              textTransform: 'uppercase',
            }}
          >
            {trip.tripName}
          </Text>

          <Text
            style={{
              fontFamily: 'outfitRegular',
              fontSize: 14,
              color: Colors.GRAY,
            }}
          >
            {trip.tripPlace}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ padding: 25, backgroundColor: Colors.WHITE, height: '100%' }}>
      <Text style={{ fontFamily: 'outfitBold', fontSize: 35, marginBottom: 20 }}>
        Khám Phá
      </Text>

      <Searchbar
        placeholder="..."
        onChangeText={handleSearch}
        value={searchQuery}
        style={{ marginBottom: 20 }}
      />

      <FlatList
        data={filteredTrips}
        keyExtractor={(item) => item.id}
        renderItem={renderTrip}
      />
    </View>
  );
}
