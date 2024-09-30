import { Colors } from '@/constants/Colors';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function Login() {

  const router = useRouter();

  return (
    <View style={styles.wrapper}>
      <Image
        source={require('./../assets/images/login_banner_2.jpg')}
        style={styles.bannerImage}
      />

      <View style={styles.container}>
        <Text style={styles.title}>VI VU DIARY</Text>

        <Text style={styles.subtitle}>
          Lưu giữ chuyến đi thanh xuân
        </Text>

        <Text style={styles.description}>
          Ứng dụng du lịch, chia sẻ và kết nối hàng đầu dành cho giới trẻ tại Việt Nam
        </Text>

        <TouchableOpacity style={styles.loginBtn}>
          <TouchableOpacity
            
            onPress={() => router.push('auth/sign-in')}>
            <Text style={styles.loginBtnText}>Bắt đầu</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  bannerImage: {
    width: '100%',
    height: 400,
    resizeMode: 'cover',
  },
  container: {
    backgroundColor: Colors.WHITE,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    padding: 20,
    flex: 1,
  },
  title: {
    fontSize: 30,
    fontFamily: 'outfitBold',
    textAlign: 'center',
    color: Colors.BLACK,
  },
  subtitle: {
    fontFamily: 'outfit',
    fontSize: 16,
    textAlign: 'center',
    color: Colors.GREY,
    marginTop: 5,
  },
  description: {
    fontFamily: 'outfit',
    fontSize: 17,
    textAlign: 'center',
    color: Colors.GREY,
    marginTop: 30,
  },
  loginBtn: {
    paddingVertical: 15,
    backgroundColor: Colors.BLACK,
    borderRadius: 30,
    marginTop: 80,
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 10,
  },
  loginBtnText: {
    color: Colors.WHITE,
    fontSize: 18,
    fontFamily: 'outfitMedium',
    textAlign: 'center',
  },
});
