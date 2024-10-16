import { View, Text } from 'react-native'
import React from 'react'
import { Entypo } from '@expo/vector-icons'
import { Colors } from '../../constants/Colors'
import { TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'

export default function StarNewTripPlan() {
    const router=useRouter();

    return (
        <View
            style={{
                padding: 20,
                marginTop: 50,
                display: 'flex',
                alignItems: 'center',
                gap: 20,
            }}>
            <Entypo name="location-pin" size={36} color="black" />
            <Text style={{
                fontSize: 25,
                fontFamily: 'outfitSemibold'
            }}>
                Không kế hoạch nào
            </Text>
            <Text style={{
                fontSize: 18,
                fontFamily: 'outfitMedium',
                textAlign: 'center',
                color: Colors.GREY
            }}>
                Có vẻ bạn chưa có kế hoạch cho những chuyết đi mới.
                Hãy bắt đầu lên kế hoạch thôi nào
            </Text>

            <TouchableOpacity onPress={() => router.push('/create-plan/search-place-plan')} style={{
                padding: 10,
                backgroundColor: Colors.PRIMARY,
                borderRadius: 10,
                paddingHorizontal: 60,
                paddingVertical: 14,
                marginTop:40
}}>
                <Text style={{
                    fontSize: 17,
                    fontFamily: 'outfitSemibold',
                    color: Colors.WHITE
                }}>
                    Tạo kế hoạch
                </Text>
            </TouchableOpacity>
        </View>
    )
}