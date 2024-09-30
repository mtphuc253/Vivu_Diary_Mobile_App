import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ToastAndroid } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { useNavigation, useRouter } from 'expo-router';
import { auth } from './../../../configs/FirebaseConfig';
import { Ionicons } from '@expo/vector-icons'; // Import biểu tượng mũi tên
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function SignIn() {
    const navigation = useNavigation();
    const router = useRouter();

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, []);

    const onSignIn = () => {
        if (!email && !password) {
            ToastAndroid.show('Vui lòng nhập đầy đủ thông tin', ToastAndroid.LONG);
            return;
        }

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                router.replace('/mytrip');
                console.log(user);

                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage, errorCode)
                if (errorCode === 'auth/network-request-failed') {
                    ToastAndroid.show('Lỗi kết nối mạng. Vui lòng kiểm tra lại Internet.', ToastAndroid.LONG);
                } else {
                    ToastAndroid.show('Đăng nhập thất bại. Hãy thử lại.', ToastAndroid.LONG);
                }

            });
    }

    return (
        <View style={styles.container}>
            {/* Nút Back */}
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>

            <Text style={styles.heading}>Chào mừng bạn!</Text>
            <Text style={styles.subHeading}>Đừng bỏ lỡ</Text>
            <Text style={styles.subHeading}>Hãy đăng nhập tài khoản</Text>

            <View style={{ margin: 10 }}></View>

            <Text style={styles.label}>E-mail</Text>
            <TextInput
                placeholder="Nhập Email"
                style={styles.input}
                placeholderTextColor={Colors.GREY}
                keyboardType="email-address"
                onChangeText={(value) => setEmail(value)}
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
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        fontFamily: 'outfit',
        backgroundColor: '#f9f9f9',
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
        color: '#888',
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
