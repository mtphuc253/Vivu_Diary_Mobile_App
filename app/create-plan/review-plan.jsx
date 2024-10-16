import { View, Text } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { useNavigation, useRouter } from 'expo-router'
import { Colors } from '../../constants/Colors';
import { AntDesign, Entypo, FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import { CreateTripContext } from '../../context/CreateTripContext';
import moment from 'moment';
import { TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { DalatJson, HueJson } from '../../constants/Options';

export default function ReviewPlan() {
    const navigation = useNavigation();
    const router = useRouter();
    const { planData, setPlanData } = useContext(CreateTripContext);

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTransparent: true,
            headerTitle: ''
        });
    }, []);
    const handleGeneratePlan = () => {
        let newPlans = [];

        if (planData.locationinfor.name.includes('Huế')) {
            newPlans = HueJson;
        } else if (planData.locationinfor.name.includes('Đà Lạt')) {
            newPlans = DalatJson;
        }

        const updatedPlans = [...(planData.plans || []), ...newPlans];

        setPlanData({
            ...planData,
            plans: updatedPlans
        });

        router.push('/create-plan/generate-plan');
    };

    return (
        <View style={{
            paddingTop: 75,
            padding: 25
        }}>
            <Text style={{
                fontFamily: "outfitBold",
                fontSize: 35,
                marginTop: 20,
            }}>Tổng quan</Text>
            <View style={{

            }}>
                <Text style={{
                    fontFamily: "outfitBold",
                    fontSize: 20,
                    color: Colors.BLACK,
                    marginTop: 20,
                    marginBottom: 50
                }}>Trước khi tạo chuyến đi của bạn, vui lòng xem lại lựa chọn của bạn</Text>
                <View style={{
                    marginTop: 20,
                    marginBottom: 20,
                    flexDirection: 'row',
                    alignItems: 'cenetr',
                    gap: 20
                }}>
                    <Entypo name="location" size={34} color="tomato" />
                    <View style={{

                    }}>
                        <Text style={{
                            fontFamily: 'outfitMedium',
                            fontSize: 20,
                            color: Colors.GREY
                        }}>
                            Điểm đến
                        </Text>
                        <Text style={{
                            fontFamily: "outfitSemibold",
                            fontSize: 20,
                            paddingRight: 50
                        }}>
                            {planData?.locationinfor?.name}
                        </Text>
                    </View>
                </View>
                <View style={{
                    marginTop: 20,
                    marginBottom: 20,
                    flexDirection: 'row',
                    alignItems: 'cenetr',
                    gap: 20
                }}>
                    <MaterialIcons name="date-range" size={34} color="#6dd5ff" />
                    <View style={{

                    }}>
                        <Text style={{
                            fontFamily: 'outfitMedium',
                            fontSize: 20,
                            color: Colors.GREY
                        }}>
                            Ngày du lịch
                        </Text>
                        <Text style={{
                            fontFamily: "outfitSemibold",
                            fontSize: 20
                        }}>
                            {moment(planData?.startDate).format('DD MMM') + " To " + moment(planData?.endDate).format('DD MMM')}
                            {"  "}({planData?.totalNoOfDays} ngày)
                        </Text>
                    </View>
                </View>
                <View style={{
                    marginTop: 20,
                    marginBottom: 20,
                    flexDirection: 'row',
                    alignItems: 'cenetr',
                    gap: 20
                }}>
                    <AntDesign name="car" size={34} color="orange" />
                    <View style={{

                    }}>
                        <Text style={{
                            fontFamily: 'outfitMedium',
                            fontSize: 20,
                            color: Colors.GREY
                        }}>
                            Đi với
                        </Text>
                        <Text style={{
                            fontFamily: "outfitSemibold",
                            fontSize: 20
                        }}>

                            {planData?.traveler?.title}
                        </Text>
                    </View>
                </View>
                <View style={{
                    marginTop: 20,
                    marginBottom: 20,
                    flexDirection: 'row',
                    alignItems: 'cenetr',
                    gap: 20
                }}>
                    <FontAwesome6 name="money-bills" size={34} color="#2a933e" />
                    <View style={{

                    }}>
                        <Text style={{
                            fontFamily: 'outfitMedium',
                            fontSize: 20,
                            color: Colors.GREY
                        }}>
                            Kinh phí
                        </Text>
                        <Text style={{
                            fontFamily: "outfitSemibold",
                            fontSize: 20
                        }}>

                            {planData?.budget}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity
                    onPress={() => handleGeneratePlan()}
                    style={{
                        width: '100%',
                        padding: 15,
                        backgroundColor: Colors.PRIMARY,
                        borderRadius: 15,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 30
                    }}>
                    <Text style={{
                        color: Colors.WHITE,
                        fontFamily: 'outfitSemibold',
                        fontSize: 20
                    }}>
                        Lên kế hoạch
                    </Text>
                </TouchableOpacity>
            </View>


        </View>
    )
}