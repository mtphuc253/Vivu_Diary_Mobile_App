import { View, Text, ToastAndroid } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import CalendarPicker from 'react-native-calendar-picker';
import { TouchableOpacity } from 'react-native';
import moment from 'moment';
import { CreateTripContext } from '../../context/CreateTripContext';

export default function SelectDates() {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const { planData, setPlanData } = useContext(CreateTripContext);
    const router = useRouter();

    const navigation = useNavigation();
    
    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTransparent: true,
            headerTitle: ''
        });
    }, []);

    useEffect(() => {
        console.log('planData', planData)
    }, [planData]);

    const onDateChange = (date, type) => {
        console.log(date, type);
        if (type == 'START_DATE') {
            setStartDate(moment(date));
        } else {
            setEndDate(moment(date));
        }
    };

    const OnDateSelectionContinue = () => {
        if (!startDate || !endDate) {
            ToastAndroid.show('Vui lòng chọn ngày bắt đầu và kết thúc', ToastAndroid.LONG);
            return;
        }

        const totalNoOfDays = endDate.diff(startDate, 'days');
        console.log(totalNoOfDays+1);
        setPlanData({
            ...planData,
            startDate: startDate,
            endDate: endDate,
            totalNoOfDays: totalNoOfDays+1
        });
        // navigation.navigate('/create-plan/select-dates');
        router.push('/create-plan/select-budget')
    };

    return (
        <View style={{
            padding: 25,
            paddingTop: 75,
            backgroundColor: Colors.WHITE,
            height: '100%'
        }}>
            <Text style={{
                fontFamily: "outfitBold",
                fontSize: 35,
                marginTop: 20
            }}>Ngày đi</Text>

            <View style={{
                marginTop: 30,
            }}>
                <CalendarPicker
                    onDateChange={onDateChange}
                    allowRangeSelection={true}
                    minDate={new Date()}
                    maxRangeDuration={10}
                    selectedRangeStyle={{
                        backgroundColor: Colors.PRIMARY,
                    }}
                    selectedDayTextStyle={{
                        color: Colors.WHITE
                    }}
                />
            </View>

            <TouchableOpacity
                onPress={OnDateSelectionContinue}
                style={{
                    width: '100%',
                    padding: 15,
                    backgroundColor: Colors.PRIMARY,
                    borderRadius: 15,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 50
                }}>
                <Text style={{
                    color: Colors.WHITE,
                    fontFamily: 'outfitMedium',
                    fontSize: 20
                }}>
                    Tiếp tục
                </Text>
            </TouchableOpacity>
        </View>
    );
}