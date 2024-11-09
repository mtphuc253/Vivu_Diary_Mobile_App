import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ToastAndroid, ImageBackground, Modal, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { useNavigation, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import authApi from '../../../service/authApi'; // Import authApi của bạn

export default function SignUp() {
    const navigation = useNavigation();
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [userName, setUserName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, []);

    const onCreateAccount = async () => {
        if (!email || !password || !fullName || !userName || !phoneNumber) {
            ToastAndroid.show('Vui lòng nhập đầy đủ thông tin', ToastAndroid.LONG);
            return;
        }

        const response = await authApi.register(fullName, phoneNumber, email, userName, password);
        if (response.success) {
            ToastAndroid.show('Đăng ký thành công. Vui lòng xác thực OTP.', ToastAndroid.LONG);
            setIsModalVisible(true);
        } else {
            ToastAndroid.show(response.message, ToastAndroid.LONG);
        }
    };

    const onVerifyEmail = async () => {
        if (!otp) {
            ToastAndroid.show('Vui lòng nhập mã OTP', ToastAndroid.LONG);
            return;
        }

        setIsLoading(true);
        try {
            const response = await authApi.verifyEmail(email, otp);
            if (response.success) {
                ToastAndroid.show('Xác thực thành công!', ToastAndroid.SHORT);
                setIsModalVisible(false);
                router.replace('/auth/sign-in');
            } else {
                ToastAndroid.show(response.message, ToastAndroid.LONG);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ImageBackground
            source={require('../../../assets/images/WelcomePage.png')}
            style={styles.backgroundImage}
        >
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.container}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                            <Ionicons name="arrow-back" size={24} color="black" />
                        </TouchableOpacity>

                        <Text style={styles.heading}>Tạo tài khoản mới</Text>

                        <Text style={styles.label}>Tên đầy đủ</Text>
                        <TextInput
                            placeholder="Nhập tên đầy đủ"
                            style={styles.input}
                            placeholderTextColor={Colors.GREY}
                            onChangeText={(value) => setFullName(value)}
                        />

                        <Text style={styles.label}>Số điện thoại</Text>
                        <TextInput
                            placeholder="Nhập số điện thoại"
                            style={styles.input}
                            placeholderTextColor={Colors.GREY}
                            keyboardType="phone-pad"
                            onChangeText={(value) => setPhoneNumber(value)}
                        />

                        <Text style={styles.label}>Tên đăng nhập</Text>
                        <TextInput
                            placeholder="Nhập tên đăng nhập"
                            style={styles.input}
                            placeholderTextColor={Colors.GREY}
                            onChangeText={(value) => setUserName(value)}
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
                        <Text style={styles.passwordHint}>
                            Mật khẩu cần có ít nhất 8 kí tự, 1 chữ in hoa, 1 chữ thường và số.
                        </Text>

                        <TouchableOpacity onPress={onCreateAccount} style={styles.signUpBtn}>
                            <Text style={styles.signUpText}>Tạo tài khoản</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.signInBtn} onPress={() => router.push('auth/sign-in')}>
                            <Text style={styles.signInText}>Đăng nhập</Text>
                        </TouchableOpacity>

                        <Modal
                            visible={isModalVisible}
                            transparent={true}
                            animationType="slide"
                        >
                            <View style={styles.modalContainer}>
                                <View style={styles.modalContent}>
                                    <Text style={styles.modalTitle}>Xác thực OTP</Text>
                                    <TextInput
                                        placeholder="Nhập mã OTP"
                                        style={styles.otpInput}
                                        placeholderTextColor={Colors.GREY}
                                        onChangeText={(value) => setOtp(value)}
                                        keyboardType="number-pad"
                                        textAlign="center"
                                    />
                                    <TouchableOpacity
                                        onPress={onVerifyEmail}
                                        style={styles.verifyBtn}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <ActivityIndicator color="#fff" />
                                        ) : (
                                            <Text style={styles.verifyText}>Xác thực</Text>
                                        )}
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.cancelBtn}>
                                        <Text style={styles.cancelText}>Hủy</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        width: '90%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    otpInput: {
        backgroundColor: '#f7f7f7',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 15,
        fontSize: 18,
        borderColor: '#ccc',
        borderWidth: 1,
        textAlign: 'center',
        width: '100%',
        marginBottom: 15,
    },
    verifyBtn: {
        backgroundColor: '#000',
        paddingVertical: 12,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
        marginBottom: 10,
    },
    verifyText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelBtn: {
        paddingVertical: 12,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    cancelText: {
        color: 'red',
        fontSize: 16,
    },
    passwordHint: {
        fontSize: 12,
        color: 'grey',
        marginTop: -10,
        marginBottom: 20,
    },

});
