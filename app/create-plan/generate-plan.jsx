import { View, Text, Image } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { Colors } from '../../constants/Colors'
import { CreateTripContext } from '../../context/CreateTripContext';
import { useNavigation, useRouter } from 'expo-router';

export default function GeneratePlan() {
    const { planData, setPlanData } = useContext(CreateTripContext);
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('(tabs)/myplan')
        }, 2000); 

        return () => clearTimeout(timer);
    }, []);


    return (
        <View style={{
            paddingTop: 75,
            padding: 25,
            height: '100%',
            backgroundColor: Colors.WHITE
        }}>
            <Text style={{
                fontFamily: "outfitBold",
                fontSize: 35,
                textAlign: 'center',
                marginTop: 20,
            }}>Vui lòng chờ...</Text>
            <Text style={{
                fontFamily: "outfitBold",
                fontSize: 20,
                textAlign: 'center',
                color: Colors.BLACK,
                marginTop: 40,
                marginBottom: 50
            }}>Vi Vu đang cố gắng tạo ra chuyến đi lý tưởng nhất cho bạn</Text>
            <View
                style={{
                    width: '100%',
                    justifyContent: 'center',
                    marginTop: 20
                }}>


                <Image
                    style={{
                        width: '100%',
                        height: 200,
                        objectFit: 'contain',
                        padding: 20
                        // marginHorizontal: '11%'
                    }}
                    source={require('./../../assets/images/plane.gif')}
                />
                <Text style={{
                    fontFamily: "outfitBold",
                    fontSize: 24,
                    textAlign: 'center',
                    color: Colors.GREY,
                    marginTop: 40,
                    marginBottom: 50
                }}>Đừng rời đi nhé</Text>
            </View>
        </View>
    )
}
