import { jwtDecode } from 'jwt-decode';
import axiosInstance from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const authApi = {
    login: async (userName, password) => {
        try {
            const response = await axiosInstance.post('/Auth/login', {
                userName,
                password,
            });

            if (response.status === 200 && response.data.status === 1) {
                const { token } = response.data.data;

                // Save token in AsyncStorage and decode user details
                await AsyncStorage.setItem('@token', token);
                const decodedToken = jwtDecode(token);

                // Extract user details from the decoded token
                const id = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid"];
                const mobilePhone = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone"];
                const userNameFromToken = decodedToken.UserName;
                const uniqueName = decodedToken.unique_name;
                const email = decodedToken.email;
                const isPremium = decodedToken.IsPremium;

                // Determine theme based on isPremium status
                const theme = isPremium === 'True' ? 'Halloween' : 'default';

                // Store user details in AsyncStorage
                await AsyncStorage.multiSet([
                    ['@userId', id],
                    ['@mobilePhone', mobilePhone],
                    ['@userName', userNameFromToken],
                    ['@uniqueName', uniqueName],
                    ['@userEmail', email],
                    ['@isPremium', isPremium],
                    ['@theme', theme],
                ]);

                return {
                    success: true,
                    message: response.data.message,
                };
            } else {
                return {
                    success: false,
                    message: response.data.message || 'Login failed',
                };
            }
        } catch (error) {
            console.error('Error logging in:', error);
            return {
                success: false,
                message: 'An error occurred. Please try again later.',
            };
        }
    },

    logout: async () => {
        try {
            await AsyncStorage.multiRemove([
                '@token', '@userId', '@mobilePhone', '@userName', 
                '@uniqueName', '@userEmail', '@isPremium', '@theme'
            ]);
            return {
                success: true,
                message: 'Logged out successfully',
            };
        } catch (error) {
            console.error('Error logging out:', error);
            return {
                success: false,
                message: 'An error occurred during logout.',
            };
        }
    },
};

export default authApi;
