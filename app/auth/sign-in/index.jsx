import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ToastAndroid, ImageBackground } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { useNavigation, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Import biểu tượng mũi tên
import AsyncStorage from '@react-native-async-storage/async-storage';
import authApi from '../../../service/authApi'; // Import authApi của bạn

export default function SignIn() {
    const navigation = useNavigation();
    const router = useRouter();

    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });

        // Kiểm tra token trong AsyncStorage khi component mount
        const checkToken = async () => {
            try {
                const token = await AsyncStorage.getItem('@token');
                if (token) {
                    // Nếu có token, chuyển hướng đến /mytrip
                    router.replace('/mytrip');
                }
            } catch (error) {
                console.error('Error checking token:', error);
            }
        };

        checkToken();
    }, []);

    const onSignIn = async () => {
        if (!userName || !password) {
            ToastAndroid.show('Vui lòng nhập đầy đủ thông tin', ToastAndroid.LONG);
            return;
        }

        const response = await authApi.login(userName, password);
        if (response.success) {
            // Đăng nhập thành công
            ToastAndroid.show('Đăng nhập thành công!', ToastAndroid.SHORT);
            router.replace('/mytrip');
        } else {
            // Thông báo lỗi nếu đăng nhập không thành công
            ToastAndroid.show(response.message, ToastAndroid.LONG);
        }
    };

    return (
        <ImageBackground
            source={require('../../../assets/images/WelcomePage.png')}
            style={styles.backgroundImage}
        >
            <View style={styles.container}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>

                <Text style={styles.heading}>Chào mừng bạn!</Text>
                <Text style={styles.subHeading}>Đừng bỏ lỡ</Text>
                <Text style={styles.subHeading}>Hãy đăng nhập tài khoản</Text>

                <View style={{ margin: 10 }}></View>

                <Text style={styles.label}>Tên đăng nhập</Text>
                <TextInput
                    placeholder="Nhập Tên Đăng Nhập"
                    style={styles.input}
                    placeholderTextColor={Colors.GREY}
                    onChangeText={(value) => setUserName(value)}
                />

                <Text style={styles.label}>Mật khẩu</Text>
                <TextInput
                    placeholder="Nhập Mật Khẩu"
                    style={styles.input}
                    placeholderTextColor={Colors.GREY}
                    secureTextEntry
                    onChangeText={(value) => setPassword(value)}
                />

                <TouchableOpacity style={styles.signInBtn} onPress={onSignIn}>
                    <Text style={styles.signInText}>Đăng nhập</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.createAccountBtn} onPress={() => router.push('auth/sign-up')}>
                    <Text style={styles.createAccountText}>Tạo tài khoản</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    container: {
        flex: 1,
        padding: 20,
        fontFamily: 'outfit',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    backBtn: {
        marginTop: 50,
        marginBottom: 20,
        alignSelf: 'flex-start',
    },
    heading: {
        fontSize: 28,
        fontFamily: 'outfitBold',
        color: '#000',
        textAlign: 'left',
        marginBottom: 10,
        marginTop: '5%',
    },
    subHeading: {
        fontSize: 22,
        color: '#000000',
        textAlign: 'left',
        marginBottom: 10,
        fontFamily: 'outfitMedium',
    },
    label: {
        fontSize: 16,
        color: '#000',
        marginBottom: 2,
        marginTop: 15,
        fontFamily: 'outfitMedium',
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingVertical: 15,
        paddingHorizontal: 10,
        marginVertical: 5,
        fontSize: 16,
        borderColor: '#ddd',
        borderWidth: 1,
        placeholder: Colors.GREY,
    },
    signInBtn: {
        backgroundColor: '#000',
        paddingVertical: 15,
        borderRadius: 8,
        marginTop: 50,
    },
    signInText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    createAccountBtn: {
        backgroundColor: Colors.WHITE,
        paddingVertical: 15,
        borderRadius: 8,
        marginTop: 15,
        borderColor: Colors.BLACK,
        borderWidth: 1,
    },
    createAccountText: {
        color: '#000',
        fontSize: 16,
        textAlign: 'center',
        fontFamily: 'outfitSemibold',
    },
});
