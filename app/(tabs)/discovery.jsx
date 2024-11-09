import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, StyleSheet, ImageBackground } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors } from '../../constants/Colors';
import { db } from '../../configs/FirebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { Searchbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Discovery() {
  const [allTrips, setAllTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState('default');
  const navigation = useNavigation();

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

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Filter trips based on the search query
  const filteredTrips = allTrips.filter((trip) => {
    const userName = trip.uniqueName;
    return userName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (loading) {
    return <ActivityIndicator size="large" color={Colors.PRIMARY} />;
  }

  const styles = createStyles(theme);

  const renderTrip = ({ item }) => {
    const trip = item.tripData;
    const userName = item.uniqueName;


    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('detail-trip/trip-detail', { trip })}
      >
        <View style={styles.userContainer}>
          <View style={styles.userAvatar}>
            <Text style={styles.userInitial}>
              {userName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.userName}>{userName}</Text>
        </View>
        <View style={styles.tripCard}>
          <Image source={{ uri: trip.tripAvt }} style={styles.tripImage} />

          <Text style={styles.tripName}>{trip.tripName}</Text>
          <Text style={styles.tripPlace}>{trip.tripPlace}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const backgroundImageSource = theme === 'Halloween'
    ? require('../../assets/images/themes/DARK_BG.png')
    : require('../../assets/images/createTrip.png');

  return (
    <ImageBackground
      source={backgroundImageSource}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Khám Phá</Text>

        <Searchbar
          placeholder="..."
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchbar}
        />

        <FlatList
          style={styles.flatList}
          data={filteredTrips}
          keyExtractor={(item) => item.id}
          renderItem={renderTrip}
        />
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
    padding: 30,
    // backgroundColor: theme === 'Halloween' ? Colors.BLACK : Colors.WHITE,
    height: '100%',
  },
  title: {
    fontFamily: 'outfitBold',
    fontSize: 35,
    marginVertical: 20
  },
  searchbar: {
    marginBottom: 20,
    backgroundColor: theme === 'Halloween' ? Colors.LIGHT_GREY : '#fffefc',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userAvatar: {
    backgroundColor: theme === 'Halloween' ? Colors.PURPLE : Colors.PRIMARY,
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  userInitial: {
    color: theme === 'Halloween' ? Colors.HALLOWEEN : Colors.WHITE,
    fontSize: 18,
  },
  userName: {
    fontFamily: 'outfitBold',
    fontSize: 16,
    color: theme === 'Halloween' ? Colors.PURPLE : Colors.BLACK,
  },
  tripCard: {
    backgroundColor: theme === 'Halloween' ? Colors.PURPLE : Colors.WHITE,
    padding: 1,
    paddingBottom: 15,
    paddingHorizontal: 0,
    borderWidth: 1,
    borderColor: theme === 'Halloween' ? Colors.HALLOWEEN : '#EDEDED',
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    borderBottomRightRadius: 7,
    borderBottomLeftRadius: 35,
    marginBottom: 20,
  },
  tripImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    borderBottomLeftRadius: 35,
    marginBottom: 15,
  },
  tripName: {
    fontFamily: 'outfitBold',
    fontSize: 22,
    textTransform: 'uppercase',
    paddingHorizontal: 25,
    color: theme === 'Halloween' ? Colors.HALLOWEEN : Colors.PRIMARY,
  },
  tripPlace: {
    fontFamily: 'outfitRegular',
    fontSize: 14,
    color: theme === 'Halloween' ? Colors.LIGHT_ORANGE : Colors.GREY,
    paddingHorizontal: 25,
    paddingBottom: 10
  },
  flatList: {
    marginBottom: 40,
  },
});
