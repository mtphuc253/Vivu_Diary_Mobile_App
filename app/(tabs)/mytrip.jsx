import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ImageBackground, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors } from '../../constants/Colors';
import StarNewTripCard from '../../components/MyTrips/StarNewTripCard';
import { db } from '../../configs/FirebaseConfig';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function MyTrip() {
  const [userTrips, setUserTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [theme, setTheme] = useState('default');
  const [userEmail, setUserEmail] = useState('');
  const navigation = useNavigation();
  const router = useRouter();

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const email = await AsyncStorage.getItem('@userEmail');
        if (email) {
          setUserEmail(email); // Lưu email vào state
        }
      } catch (error) {
        console.error('Error fetching email from AsyncStorage: ', error);
      }
    };

    fetchUserEmail();
  }, []);

  useEffect(() => {
    const fetchUserTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('@theme');
        setTheme(storedTheme === 'Halloween' ? 'Halloween' : 'default');
      } catch (error) {
        console.error('Error fetching theme from AsyncStorage:', error);
      }
    };

    fetchUserTheme();
  }, []);

  useEffect(() => {
    const fetchUserTrips = async () => {
      if (userEmail) { // Kiểm tra nếu email đã được lấy từ AsyncStorage
        try {
          const tripsQuery = query(
            collection(db, 'DiaryTrips'),
            where('userEmail', '==', userEmail)
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
  }, [userEmail]); // Chạy khi userEmail thay đổi

  useEffect(() => {
    console.log('userTrips: ', userTrips);
  }, [userTrips]);

  const handleDeleteTrip = async (tripId) => {
    setIsDeleting(true); // Bắt đầu hiệu ứng loading khi xóa
    try {
      // Xóa dữ liệu từ Firestore
      await deleteDoc(doc(db, 'DiaryTrips', tripId));

      // Cập nhật lại danh sách userTrips sau khi xóa
      setUserTrips(prevTrips => prevTrips.filter(trip => trip.id !== tripId));

      console.log('Trip deleted successfully:', tripId);
    } catch (error) {
      console.error('Error deleting trip:', error);
    } finally {
      setIsDeleting(false); // Kết thúc hiệu ứng loading khi hoàn thành hoặc có lỗi
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }
  const styles = createStyles(theme);

  const backgroundImageSource = theme === 'Halloween'
    ? require('../../../../Project/vivu-diary/assets/images/themes/HALLOWEEN_BG.png')
    : require('../../../../Project/vivu-diary/assets/images/createTrip.png');
  return (
    <ImageBackground
      source={backgroundImageSource}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Chuyến đi của tôi</Text>
        </View>

        {isDeleting && ( // Hiển thị hiệu ứng loading ở giữa màn hình khi đang xóa
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={Colors.PRIMARY} />
          </View>
        )}

        {userTrips?.length === 0 ? (
          <StarNewTripCard />
        ) : (
          <FlatList
            style={{ marginBottom: 60 }}
            data={userTrips}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const trip = item.tripData;
              return (
                <View style={styles.tripCardContainer}>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteTrip(item.id)}
                  >
                    <Ionicons name="close-circle" size={32} color={Colors.WHITE} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => navigation.navigate('detail-trip/trip-detail', { trip })}
                  >
                    <View style={styles.tripCard}>
                      <Image
                        source={{ uri: trip.tripAvt }}
                        style={styles.tripImage}
                      />

                      <Text style={styles.tripName}>
                        {trip.tripName}
                      </Text>

                      <Text style={styles.tripPlace}>
                        {trip.tripPlace}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        )}

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/create-trip/search-place')}
        >
          <Text style={styles.addButtonText}>
            +
          </Text>
        </TouchableOpacity>
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
    padding: 25,
    paddingTop: 55,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: 'outfitBold',
    fontSize: 35,
    color: theme === 'Halloween' ? Colors.PURPLE : Colors.BLACK,
  },
  tripCardContainer: {
    position: 'relative',
  },
  deleteButton: {
    position: 'absolute',
    top: 28,
    right: 8,
    zIndex: 1,
  },
  tripCard: {
    backgroundColor: theme === 'Halloween' ? Colors.PURPLE : Colors.WHITE,
    padding: 15,
    paddingTop: 1,
    paddingHorizontal: 0,
    borderWidth: 2,
    borderColor: theme === 'Halloween' ? Colors.BLACK : '#EDEDED',
    borderRadius: 10,
    marginBottom: 0,
    marginTop: 20,
  },
  tripImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    marginBottom: 15,

  },
  tripName: {
    fontFamily: 'outfitBold',
    fontSize: 22,
    textTransform: 'uppercase',
    paddingHorizontal: 15,
    color: theme === 'Halloween' ? Colors.HALLOWEEN : Colors.PRIMARY,
  },
  tripPlace: {
    fontFamily: 'outfitRegular',
    fontSize: 14,
    color: Colors.LIGHT_ORANGE,
    paddingHorizontal: 15
  },
  addButton: {
    position: 'absolute',
    bottom: 90,
    right: 30,
    backgroundColor: theme === 'Halloween' ? Colors.HALLOWEEN : Colors.PRIMARY,
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
  },
  addButtonText: {
    fontSize: 30,
    color: theme === 'Halloween' ? Colors.BLACK : Colors.WHITE,
    lineHeight: 35,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 2,
  },
});
