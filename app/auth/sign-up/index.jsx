import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ToastAndroid, ImageBackground } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { useNavigation, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { auth } from './../../../configs/FirebaseConfig';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';

export default function SignUp() {
    const navigation = useNavigation();
    const router = useRouter();

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [fullName, setFullName] = useState();

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, []);

    const OnCreateAccount = () => {
        if (!email && !password && !fullName) {
            ToastAndroid.show('Vui lòng nhập đầy đủ thông tin', ToastAndroid.LONG);
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                sendEmailVerification(auth.currentUser)
                .then(() => {
                    alert("Email xác thực đã được gửi. Vui lòng xác thực");
                });

                const user = userCredential.user;
                console.log('user: ', user);
                router.replace('/auth/sign-in');
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage, errorCode);
            });
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

                <Text style={styles.heading}>Tạo tài khoản mới</Text>

                <Text style={styles.label}>Tên đăng nhập</Text>
                <TextInput
                    placeholder="Nhập tên đăng nhập"
                    style={styles.input}
                    placeholderTextColor={Colors.GREY}
                    onChangeText={(value) => setFullName(value)}
                />

                <Text style={styles.label}>Email</Text>
                <TextInput
                    placeholder="Nhập email"
                    style={styles.input}
                    placeholderTextColor={Colors.GREY}
                    keyboardType="email-address"
                    onChangeText={(value) => setEmail(value)}
                />

                <Text style={styles.label}>Mật khẩu</Text>
                <TextInput
                    placeholder="Nhập mật khẩu"
                    style={styles.input}
                    placeholderTextColor={Colors.GREY}
                    secureTextEntry
                    onChangeText={(value) => setPassword(value)}
                />

                <TouchableOpacity onPress={OnCreateAccount} style={styles.signUpBtn}>
                    <Text style={styles.signUpText}>Tạo tài khoản</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.signInBtn} onPress={() => router.push('auth/sign-in')}>
                    <Text style={styles.signInText}>Đăng nhập</Text>
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
        backgroundColor: 'rgba(255, 255, 255, 0.5)', 
    },
    backBtn: {
        marginTop: 50,
        marginBottom: 20,
        alignSelf: 'flex-start',
    },
    heading: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'left',
        marginBottom: 30,
    },
    label: {
        fontSize: 16,
        color: '#000',
        marginBottom: 8,
        fontWeight: '500',
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingVertical: 15,
        paddingHorizontal: 10,
        marginBottom: 20,
        fontSize: 16,
        borderColor: '#ddd',
        borderWidth: 1,
    },
    signUpBtn: {
        backgroundColor: '#000',
        paddingVertical: 15,
        borderRadius: 8,
        marginTop: 20,
    },
    signUpText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    signInBtn: {
        backgroundColor: Colors.WHITE,
        paddingVertical: 15,
        borderRadius: 8,
        marginTop: 15,
        borderColor: Colors.BLACK,
        borderWidth: 1,
    },
    signInText: {
        color: '#000',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '500',
    },
});
