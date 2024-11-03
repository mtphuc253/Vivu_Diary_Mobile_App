import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ToastAndroid, Modal, FlatList, Image, ImageBackground, ActivityIndicator, Linking } from 'react-native';
import * as Updates from 'expo-updates';
import { useRouter } from 'expo-router';
import { MaterialIcons, Entypo, Ionicons } from '@expo/vector-icons';
import authApi from '../../service/authApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../constants/Colors';
import { db } from '../../configs/FirebaseConfig';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import paymentApi from '../../service/paymentApi';

export default function Profile() {
  const router = useRouter();
  const [userData, setUserData] = useState({});
  const [userTrips, setUserTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isPremium, setIsPremium] = useState(null);
  const [theme, setTheme] = useState('default');
  const [themeModalVisible, setThemeModalVisible] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const email = await AsyncStorage.getItem('@userEmail');
        const uniqueName = await AsyncStorage.getItem('@uniqueName');
        const mobilePhone = await AsyncStorage.getItem('@mobilePhone');
        const userId = await AsyncStorage.getItem('@userId');
        const isPremium = await AsyncStorage.getItem('@isPremium');
        const storedTheme = await AsyncStorage.getItem('@theme');
        setTheme(storedTheme === 'Halloween' ? 'Halloween' : 'default');
        setUserData({ email, uniqueName, mobilePhone, userId, isPremium });
        if (email) {
          fetchUserTrips(email);
        }
      } catch (error) {
        console.error('Error fetching user data from AsyncStorage:', error);
      }
    };

    const fetchUserTrips = async (email) => {
      try {
        const tripsQuery = query(
          collection(db, 'DiaryTrips'),
          where('userEmail', '==', email)
        );
        const querySnapshot = await getDocs(tripsQuery);
        const fetchedTrips = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUserTrips(fetchedTrips);
      } catch (error) {
        console.error('Error fetching trips:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const styles = createStyles(theme);

  const handleLogout = async () => {
    try {
      const response = await authApi.logout();
      if (response.success) {
        ToastAndroid.show('Đăng xuất thành công!', ToastAndroid.SHORT);
        router.replace('/auth/sign-in');
      } else {
        ToastAndroid.show('Đăng xuất thất bại. Hãy thử lại.', ToastAndroid.LONG);
      }
    } catch (error) {
      console.error('Error during logout:', error);
      ToastAndroid.show('Đã xảy ra lỗi. Vui lòng thử lại sau.', ToastAndroid.LONG);
    }
    setMenuVisible(false);
  };

  const handleSubscriptionSelect = async (option) => {
    try {
      let momoUrl = '';
      let subscriptionId = 0;
      let amount = option.amount;

      switch (option.label) {
        case '59.000đ/1 tháng':
          momoUrl = 'https://me.momo.vn/j8IyuAIPTzs2CkI7uOiW/pnelRLLwMMZ6bKB';
          subscriptionId = 1;
          amount = 59000;
          break;
        case '149.000đ/3 tháng':
          momoUrl = 'https://me.momo.vn/j8IyuAIPTzs2CkI7uOiW/LDdw055LRMWme1Y';
          subscriptionId = 2;
          amount = 149000;
          break;
        case '499.000đ/1 năm':
          momoUrl = 'https://me.momo.vn/j8IyuAIPTzs2CkI7uOiW/K9b6Wyy12v4RdEv';
          subscriptionId = 3;
          amount = 499000;
          break;
        default:
          ToastAndroid.show('Gói không hợp lệ', ToastAndroid.SHORT);
          return;
      }

      const userId = await AsyncStorage.getItem('@userId');
      if (!userId) {
        console.error('User ID not found');
        return;
      }

      const orderId = new Date().toISOString();

      console.log('Dữ liệu thanh toán:', { userId, amount, orderId, subscriptionId });

      const response = await paymentApi.createPayment(parseInt(userId), amount, orderId, subscriptionId);
      console.log("Respone body from API: ", response);

      if (response.success) {
        const supported = await Linking.canOpenURL(momoUrl);
        if (supported) {
          Linking.openURL(momoUrl);
          ToastAndroid.show('Chuyển hướng đến Momo...', ToastAndroid.LONG);
          setTimeout(() => {
            Updates.reloadAsync();
          }, 2000); 
        } else {
          ToastAndroid.show('Không thể mở URL', ToastAndroid.LONG);
        }
      } else {
        ToastAndroid.show(response.message || 'Thanh toán thất bại', ToastAndroid.LONG);
      }

    } catch (error) {
      console.error('Error handling subscription select:', error);
      ToastAndroid.show('Đã xảy ra lỗi, vui lòng thử lại.', ToastAndroid.LONG);
    }
  };

  const SubscriptionOptions = [
    { label: '59.000đ/1 tháng', value: '1 month', amount: 59000 },
    { label: '149.000đ/3 tháng', value: '3 months', amount: 149000 },
    { label: '499.000đ/1 năm', value: '1 year', amount: 499000 },
  ];


  return (
    <ImageBackground
      source={theme === 'Halloween' ? require('../../assets/images/themes/HALLOWEEN_BG.png') : require('../../assets/images/createTrip.png')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setModalVisible(true)} style={{ opacity: userData.isPremium === 'True' ? 0 : 1 }}>
            <MaterialIcons name="workspace-premium" size={36} color="#edb100" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setMenuVisible(true)}>
            <Entypo name="dots-three-vertical" size={24} color={theme === 'Halloween' ? Colors.WHITE : "grey"} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {userData.uniqueName ? userData.uniqueName.charAt(0).toUpperCase() : ''}
              </Text>
            </View>
            <Text style={styles.uniqueName}>{userData.uniqueName?.toUpperCase()}</Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>Thông tin cá nhân</Text>
            <Text style={styles.infoText}>Email: {userData.email}</Text>
            <Text style={styles.infoText}>Số điện thoại: {userData.mobilePhone}</Text>
            <Text style={styles.infoText}>
              Tài khoản: {userData.isPremium === 'True' ? 'Premium' : 'Thường'}
            </Text>

          </View>

          {isDeleting && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={Colors.PRIMARY} />
            </View>
          )}

          {userTrips?.length > 0 && (
            <>
              <Text style={styles.tripsTitle}>Chuyến đi gần nhất</Text>
              <FlatList
                style={{ paddingHorizontal: 10 }}
                data={userTrips}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  const trip = item.tripData;
                  return (
                    <View style={styles.tripCardContainer}>
                      <TouchableOpacity
                        // onPress={() => router.push('detail-trip/trip-detail', { trip })}
                        style={styles.tripCard}
                      >
                        <Image
                          source={{ uri: trip.tripAvt }}
                          style={styles.tripImage}
                        />
                        <Text style={styles.tripName}>{trip.tripName}</Text>
                      </TouchableOpacity>
                    </View>
                  );
                }}
              />
            </>
          )}

        </View>

        {/* Modal chọn gói trả phí */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={30} color={theme === 'Halloween' ? Colors.WHITE : "black"} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Thoải mái đăng tải hình ảnh</Text>
              <Text style={styles.trialText}>Với các gói nâng cấp</Text>
              <FlatList
                data={SubscriptionOptions}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.subscriptionCard,
                      selectedOption?.value === item.value && styles.selectedCard,
                    ]}
                    onPress={() => setSelectedOption(item)}
                  >
                    <View style={styles.subscriptionDetails}>
                      <Text style={styles.subscriptionLabel}>{item.label}</Text>
                    </View>
                    {selectedOption?.value === item.value && (
                      <Ionicons name="checkmark-circle" size={24} color={theme === 'Halloween' ? Colors.HALLOWEEN : Colors.PRIMARY} style={styles.checkmarkIcon} />
                    )}
                  </TouchableOpacity>
                )}
              />

              <TouchableOpacity
                style={[styles.startButton, !selectedOption && { backgroundColor: '#ccc' }]}
                onPress={() => handleSubscriptionSelect(selectedOption)}
                disabled={!selectedOption}
              >
                <Text style={styles.startButtonText}>Tiếp tục</Text>
              </TouchableOpacity>

              <Text style={styles.cancelText}>Có thể hủy bất cứ lúc nào</Text>
              <Text style={styles.policyText}>Cancel anytime. Subscriptions renew automatically each period. <Text style={{ textDecorationLine: 'underline' }}>Terms of service</Text> | <Text style={{ textDecorationLine: 'underline' }}>Privacy policy</Text></Text>
            </View>
          </View>
        </Modal>

        {/* Menu đăng xuất */}
        <Modal
          visible={menuVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setMenuVisible(false)}
        >
          <View style={styles.menuBackground}>
            <View style={styles.menuContainer}>
              <TouchableOpacity onPress={handleLogout} style={styles.menuItem}>
                <Text style={styles.menuItemText}>Đăng xuất</Text>
              </TouchableOpacity>
              {userData.isPremium === 'True' && (
                <TouchableOpacity onPress={() => setThemeModalVisible(true)} style={styles.menuItem}>
                  <Text style={styles.menuItemText}>Thay đổi giao diện</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.menuItem} onPress={() => setMenuVisible(false)}>
                <Text style={styles.menuItemText}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          visible={themeModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setThemeModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Chọn giao diện</Text>
              <View style={styles.optionContainer}>
                <TouchableOpacity
                  style={[styles.option, selectedTheme === 'default' && styles.selectedOption]}
                  onPress={() => setSelectedTheme('default')}
                >
                  <Image
                    source={require('../../assets/images/themes/DEFAULT_DISPLAY.png')}
                    style={styles.optionImage}
                  />
                  <Text style={styles.optionText}>Mặc định</Text>
                </TouchableOpacity>

                {/* Option cho Halloween */}
                <TouchableOpacity
                  style={[styles.option, selectedTheme === 'Halloween' && styles.selectedOption]}
                  onPress={() => setSelectedTheme('Halloween')}
                >
                  <Image
                    source={require('../../assets/images/themes/HALLOWEEN_DISPLAY.png')}
                    style={styles.optionImage}
                  />
                  <Text style={styles.optionText}>Halloween</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={async () => {
                  await AsyncStorage.setItem('@theme', selectedTheme === 'Halloween' ? 'Halloween' : 'default');
                  setThemeModalVisible(false);
                  ToastAndroid.show('Đã áp dụng giao diện mới', ToastAndroid.SHORT);
                  await Updates.reloadAsync();
                }}
                disabled={!selectedTheme}
              >
                <Text style={styles.applyButtonText}>Áp dụng</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setThemeModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

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
    padding: 15,
    paddingTop: 55,
    backgroundColor: theme === 'Halloween' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.2)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  content: {
    flex: 1,
    backgroundColor: theme === 'Halloween' ? Colors.BLACK : Colors.WHITE,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 10,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: -45,
  },
  avatar: {
    backgroundColor: theme === 'Halloween' ? Colors.HALLOWEEN : Colors.PRIMARY,
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
    color: '#fff',
    fontWeight: 'bold',
  },
  uniqueName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 15,
    textTransform: 'uppercase',
    color: theme === 'Halloween' ? Colors.LIGHT_ORANGE : Colors.BLACK,
  },
  tripsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingHorizontal: 10,
    color: theme === 'Halloween' ? Colors.LIGHT_ORANGE : Colors.BLACK,

  },

  infoContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: '#ededed',
  },
  subscriptionCard: {
    backgroundColor: theme === 'Halloween' ? Colors.BLACK : Colors.WHITE,
    borderWidth: 1,
    borderColor: theme === 'Halloween' ? Colors.HALLOWEEN : Colors.PRIMARY,
    borderRadius: 10,
    padding: 15,
    width: '100%',
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedCard: {
    borderColor: theme === 'Halloween' ? Colors.HALLOWEEN : Colors.PRIMARY,
  },
  checkmarkIcon: {
    marginLeft: 10,
  },
  subscriptionDetails: {
    flexDirection: 'column',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: theme === 'Halloween' ? Colors.LIGHT_ORANGE : Colors.BLACK,

  },
  infoText: {
    fontSize: 16,
    marginBottom: 8,
    color: theme === 'Halloween' ? Colors.LIGHT_ORANGE : Colors.GREY,

  },
  tripCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
    backgroundColor: theme === 'Halloween' ? Colors.BLACK : Colors.WHITE,
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  tripCard: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  tripImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
  },
  tripName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme === 'Halloween' ? Colors.LIGHT_ORANGE : Colors.BLACK,
    flex: 1,
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
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: theme === 'Halloween' ? Colors.HALLOWEEN : "#f9fcff",
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme === 'Halloween' ? Colors.PURPLE : Colors.BLACK,
  },
  trialText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme === 'Halloween' ? Colors.LIGHT_ORANGE : Colors.PRIMARY,
    marginVertical: 10,
  },
  saveMore: {
    backgroundColor: '#FF4500',
    color: '#fff',
    padding: 5,
    borderRadius: 3,
    fontSize: 12,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  subscriptionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme === 'Halloween' ? Colors.HALLOWEEN : Colors.BLACK,
  },
  subscriptionPrice: {
    fontSize: 14,
    color: '#333',
    marginVertical: 5,
  },
  subscriptionDescription: {
    fontSize: 12,
    color: '#777',
  },
  startButton: {
    backgroundColor: theme === 'Halloween' ? Colors.HALLOWEEN : Colors.PRIMARY,
    paddingVertical: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginVertical: 20,
  },
  startButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelText: {
    fontSize: 12,
    color: theme === 'Halloween' ? Colors.LIGHT_ORANGE : '#666',
    marginVertical: 10,
  },
  policyText: {
    fontSize: 10,
    color: theme === 'Halloween' ? Colors.LIGHT_ORANGE : '#666',
    textAlign: 'center',
    marginTop: 10,
  }, nButton: {
    padding: 10,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 5,
    marginBottom: 10,
  },
  optionText: {
    marginTop: 10,
    fontSize: 16,
    color: theme === 'Halloween' ? Colors.LIGHT_ORANGE : Colors.BLACK,
    fontWeight: '500',
  },

  closeButton: {
    marginBottom: 20
  },
  closeButtonText: {
    color: '#000',
    fontSize: 16,
  },
  menuBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  menuItem: {
    padding: 15,
  },
  menuItemText: {
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  themeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  themeOption: {
    alignItems: 'center',
    width: '45%',
  },
  selectedOption: {
    borderWidth: 2,
    borderColor: Colors.PRIMARY,
    borderRadius: 10,
    padding: 5,
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
  },
  option: {
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme === 'Halloween' ? Colors.HALLOWEEN : Colors.WHITE,
    borderRadius: 10,
    padding: 5,
    width: 105,
    height: 180,
    overflow: 'hidden',
  },
  selectedOption: {
    borderColor: theme === 'Halloween' ? Colors.PURPLE : Colors.PRIMARY,
  },
  optionImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    resizeMode: 'contain',
  },
  themePreview: {
    width: 60,
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
  },
  themeLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  applyButton: {
    backgroundColor: theme === 'Halloween' ? Colors.PURPLE : Colors.PRIMARY,
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 20,
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 50,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderRadius: 8,
    alignItems: 'center',
    borderColor: theme === 'Halloween' ? Colors.PURPLE : Colors.PRIMARY
  },
  cancelButtonText: {
    color: theme === 'Halloween' ? Colors.PURPLE : Colors.PRIMARY,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

