import { View, Text, FlatList } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Link, router, useNavigation } from 'expo-router'
import { Colors } from '../../constants/Colors';
import { SelectTravelsList } from '../../constants/Options';
import OptionCard from '../../components/CreatePlan/OptionCard';
import { TouchableOpacity } from 'react-native';
import { CreateTripContext } from '../../context/CreateTripContext';

export default function SelectTraveler() {

    const navigation = useNavigation();
    const [selectedOption, setSelectedOption] = useState();
    const { planData, setPlanData } = useContext(CreateTripContext);


    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTransparent: true,
            headerTitle: ''
        })
    }, []);

    useEffect(() => {
        setPlanData({
            ...planData,
            traveler: selectedOption
        })
    }, [selectedOption]);

    useEffect(() => {
        console.log('planData', planData)
    }, [planData]);

    return (
        <View
            style={{
                padding: 25,
                paddingTop: 75,
                backgroundColor: Colors.WHITE,
                height: '100%',

            }}>
            <Text style={{
                fontSize: 30,
                fontFamily: "outfitBold",
                marginTop: 20
            }}>
                Bạn sẽ đi cùng ai?
            </Text>

            <View style={{
                marginTop: 20
            }}>
                <Text style={{
                    fontFamily: 'outfitBold',
                    fontSize: 23
                }}>
                    Chọn người đi cùng bạn
                </Text>

                <FlatList
                    data={SelectTravelsList}
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
            </View>


            <TouchableOpacity
                style={{
                    width: '100%',
                    padding: 15,
                    backgroundColor: Colors.PRIMARY,
                    borderRadius: 15,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 20
                }}>
                <Link
                    style={{
                        width: '100%',
                        textAlign: 'center'
                    }}
                    href={'/create-plan/select-dates'}>
                    <Text style={{
                        color: Colors.WHITE,
                        fontFamily: 'outfitSemibold',
                        fontSize: 20
                    }}>
                        Tiếp tục
                    </Text>
                </Link>
            </TouchableOpacity>

        </View >
    )
}