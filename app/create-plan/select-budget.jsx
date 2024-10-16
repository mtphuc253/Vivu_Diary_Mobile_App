import { View, Text, FlatList, ToastAndroid } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigation, useRouter } from 'expo-router'
import { Colors } from '../../constants/Colors';
import { SelectBudgetOption } from '../../constants/Options';
import OptionCard from '../../components/CreatePlan/OptionCard';
import { TouchableOpacity } from 'react-native';
import { CreateTripContext } from '../../context/CreateTripContext';

export default function SelectBudget() {
    const [selectedOption, setSelectedOption] = useState();
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
        selectedOption && setPlanData({
            ...planData,
            budget: selectedOption?.title
        })
    }, [selectedOption]);

    const onPressContinue = () => {
        if (!selectedOption) {
            ToastAndroid.show('Hãy chọn mức kinh phí cho chuyến đi', ToastAndroid.LONG);
            return;
        }
        router.push('/create-plan/review-plan')
    }
    return (
        <View style={{
            paddingTop: 75,
            padding: 25
        }}>
            <Text style={{
                fontFamily: "outfitBold",
                fontSize: 35,
                marginTop: 20
            }}>Kinh phí </Text>

            <View style={{

            }}>
                <Text style={{
                    fontFamily: "outfitBold",
                    fontSize: 20,
                    color: Colors.BLACK,
                    marginTop: 20,
                    marginBottom: 50
                }}>Mức ngân sách bạn có thể chi cho chuyến đi </Text>
            </View>
            <FlatList
                data={SelectBudgetOption}
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        onPress={() => setSelectedOption(item)}
                        style={{
                            marginVertical: 10,
                        }}>
                        <OptionCard option={item} selectedOption={selectedOption} />
                    </TouchableOpacity>
                )}
            />
            <TouchableOpacity
            onPress={() => onPressContinue()}
                style={{
                    width: '100%',
                    padding: 15,
                    backgroundColor: Colors.PRIMARY,
                    borderRadius: 15,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 20
                }}>
                <Text style={{
                    color: Colors.WHITE,
                    fontFamily: 'outfitSemibold',
                    fontSize: 20
                }}>
                    Tiếp tục
                </Text>
            </TouchableOpacity>
        </View>


    )
}