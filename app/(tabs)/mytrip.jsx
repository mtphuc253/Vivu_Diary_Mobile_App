import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors } from '../../constants/Colors';
import StarNewTripCard from '../../components/MyTrips/StarNewTripCard';
import { db, auth } from '../../configs/FirebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { useRouter } from 'expo-router';

export default function MyTrip() {
  const [userTrips, setUserTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = auth.currentUser;
  const navigation = useNavigation(); // Khởi tạo navigation
  const router = useRouter();

  useEffect(() => {
    const fetchUserTrips = async () => {
      if (currentUser) {
        try {
          const tripsQuery = query(
            collection(db, 'DiaryTrips'),
            where('userEmail', '==', currentUser.email)
          );
          const querySnapshot = await getDocs(tripsQuery);

          const trips = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));

          setUserTrips(trips);
          console.log(trips);
        } catch (error) {
          console.error('Error fetching trips: ', error);
        }
      }
      setLoading(false);
    };

    fetchUserTrips();
  }, [currentUser]);

  useEffect(() => {
    console.log('userTrips: ', userTrips);
  }, [userTrips]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View
      style={{
        padding: 25,
        paddingTop: 55,
        backgroundColor: Colors.WHITE,
        height: '100%',
      }}
    >
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignContent: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text
          style={{
            fontFamily: 'outfitBold',
            fontSize: 35,
          }}
        >
          Chuyến đi của tôi
        </Text>
      </View>

      {userTrips?.length === 0 ? (
        <StarNewTripCard />
      ) : (
        <FlatList
          data={userTrips}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const trip = item.tripData;
            return (
              <TouchableOpacity
                onPress={() => navigation.navigate('trip-detail', { trip })} // Điều hướng sang TripDetail và truyền dữ liệu chuyến đi
              >
                <View
                  style={{
                    backgroundColor: Colors.WHITE,
                    padding: 15,
                    borderWidth: 1,
                    borderColor: '#EDEDED',
                    borderRadius: 15,
                    marginBottom: 0,
                    marginTop: 20,
                  }}
                >
                  <Image
                    source={{ uri: trip.tripAvt }}
                    style={{
                      width: '100%',
                      height: 200,
                      borderRadius: 10,
                      marginBottom: 15,
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
          }}
        />
      )}

      {/* Nút dấu cộng ở góc dưới bên trái */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 90,
          right: 30,
          backgroundColor: Colors.PRIMARY,
          borderRadius: 30,
          width: 60,
          height: 60,
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.3,
          shadowRadius: 6.27,
          elevation: 10,
        }}
        onPress={() => router.push('/create-trip/search-place')}
      >
        <Text
          style={{
            fontSize: 30,
            color: Colors.WHITE,
            lineHeight: 35,
          }}
        >
          +
        </Text>
      </TouchableOpacity>
    </View>
  );
}
