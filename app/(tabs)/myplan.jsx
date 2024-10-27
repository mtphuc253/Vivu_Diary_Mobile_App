import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Image, FlatList, Alert } from 'react-native';
import { Colors } from '../../constants/Colors';
import StarNewTripPlan from '../../components/MyTrips/StarNewTripPlan';
import { CreateTripContext } from '../../context/CreateTripContext';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function MyPlan() {
    const { planData, setPlanData } = useContext(CreateTripContext);
    const [userPlans, setUserPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedDays, setExpandedDays] = useState({});
    const [expandedTimes, setExpandedTimes] = useState({});
    const router = useRouter();

    useEffect(() => {
        if (planData.plans && planData.plans.length > 0) {
            setUserPlans(planData.plans);
        }
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, [planData]);

    const toggleDay = (day) => {
        setExpandedDays((prev) => ({
            ...prev,
            [day]: !prev[day],
        }));
    };

    const toggleTime = (day, time) => {
        setExpandedTimes((prev) => ({
            ...prev,
            [`${day}-${time}`]: !prev[`${day}-${time}`],
        }));
    };

    const handleCompletePlan = (planIndex) => {
        Alert.alert(
            "Xác nhận",
            "Bạn có chắc chắn muốn đánh dấu chuyến đi này là hoàn thành không?",
            [
                {
                    text: "Hủy",
                    style: "cancel"
                },
                {
                    text: "Hoàn thành",
                    onPress: () => {
                        const updatedPlans = userPlans.filter((_, index) => index !== planIndex);
                        setUserPlans(updatedPlans);
                        setPlanData({ ...planData, plans: updatedPlans }); // Cập nhật dữ liệu trong context
                    },
                    style: "destructive"
                }
            ]
        );
    };

    const renderDayPlan = ({ item }) => (
        <View style={styles.dayContainer}>
            <TouchableOpacity onPress={() => toggleDay(item.day)} style={styles.dayHeader}>
                <Text style={styles.dayText}>{item.day}</Text>
                <AntDesign name={expandedDays[item.day] ? "up" : "down"} size={20} />
            </TouchableOpacity>
            {expandedDays[item.day] && (
                <View style={styles.detailsContainer}>
                    {Object.entries(item).map(([time, details]) => (
                        time !== 'day' && (
                            <View key={time} style={styles.timeContainer}>
                                <TouchableOpacity onPress={() => toggleTime(item.day, time)} style={styles.timeHeader}>
                                    <Text style={styles.timeText}>{getTimeLabel(time)}</Text>
                                    <AntDesign name={expandedTimes[`${item.day}-${time}`] ? "up" : "down"} size={20} />
                                </TouchableOpacity>
                                {expandedTimes[`${item.day}-${time}`] && (
                                    <View style={styles.activityDetails}>
                                        {details.accommodation && (
                                            <Text style={styles.detailText}>Khách sạn: {details.accommodation}</Text>
                                        )}
                                        {details.dining && (
                                            <View style={styles.diningDetails}>
                                                <Text style={styles.diningName}>Ăn uống: {details.dining}</Text>
                                                <Text style={styles.diningDetailsText}>
                                                    {details.diningDetails.PlaceDetails}
                                                </Text>
                                                {/* <Image source={{ uri: details.diningDetails.PlaceImageUrl }} style={styles.diningImage} /> */}
                                                <Text style={styles.detailText}>Địa điểm: {details.diningDetails.placeName}</Text>
                                                <Text style={styles.detailText}>Phí vào cửa: {details.diningDetails.entranceFee}</Text>
                                            </View>
                                        )}
                                        {details.attraction && (
                                            <View style={styles.attractionDetails}>
                                                <Text style={styles.attractionName}>Tham quan: {details.attraction}</Text>
                                                <Text style={styles.attractionDetailsText}>
                                                    {details.attractionDetails.PlaceDetails}
                                                </Text>
                                                <Image source={{ uri: details.attractionDetails.PlaceImageUrl }} style={styles.attractionImage} />
                                                <Text style={styles.detailText}>Địa điểm: {details.attractionDetails.placeName}</Text>
                                                <Text style={styles.detailText}>Phí vào cửa: {details.attractionDetails.entranceFee}</Text>
                                                <Text style={styles.detailText}>Tọa độ: {details.attractionDetails.coordinates}</Text>
                                            </View>
                                        )}
                                        {details.hotel && (
                                            <View style={styles.hotelDetails}>
                                                <Text style={styles.hotelName}>{details.hotel.HotelName}</Text>
                                                <Text style={styles.hotelInfo}>Địa chỉ: {details.hotel.HotelAddress}</Text>
                                                <Text style={styles.hotelInfo}>Giá: {details.hotel.Price}</Text>
                                            </View>
                                        )}
                                    </View>
                                )}
                            </View>
                        )
                    ))}
                </View>
            )}
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.PRIMARY} />
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Kế hoạch</Text>
                <AntDesign name="pluscircle" size={35} color="black" />
            </View>

            {userPlans.length > 0 ? (
                <FlatList
                    data={userPlans.map((plan, index) => ({
                        destination: plan.trip.destination,
                        plan: plan.trip.plan,
                        index: index
                    }))}
                    keyExtractor={(item) => item.index.toString()}
                    renderItem={({ item }) => (
                        <>
                            <View style={styles.tripHeader}>
                                <Text style={styles.destinationText}>
                                    {item.destination}
                                </Text>
                                <TouchableOpacity onPress={() => handleCompletePlan(item.index)}>
                                    <AntDesign name="checkcircleo" size={24} color={Colors.PRIMARY} />
                                </TouchableOpacity>
                            </View>
                            <FlatList
                                data={item.plan}
                                keyExtractor={(dayItem) => dayItem.day}
                                renderItem={renderDayPlan}
                                nestedScrollEnabled={true}
                            />
                        </>
                    )}
                    nestedScrollEnabled={true}
                />
            ) : (
                <StarNewTripPlan />
            )}

            <TouchableOpacity
                style={{
                    position: 'absolute',
                    bottom: 90,
                    right: 30,
                    backgroundColor: Colors.PRIMARY,
                    borderRadius: 30,
                    width: 60,
                    height: 60,
                    justifyContent: 'center',
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 5 },
                    shadowOpacity: 0.3,
                    shadowRadius: 6.27,
                    elevation: 10,
                }}
                onPress={() => router.push('/create-plan/search-place-plan')}
            >
                <Text
                    style={{
                        fontSize: 30,
                        color: Colors.WHITE,
                        lineHeight: 35,
                    }}
                >
                    +
                </Text>
            </TouchableOpacity>
        </View>
    );
}

// Helper function to get time labels in Vietnamese
const getTimeLabel = (time) => {
    switch (time) {
        case 'morning':
            return 'Buổi sáng';
        case 'noon':
            return 'Buổi trưa';
        case 'afternoon':
            return 'Buổi chiều';
        case 'evening':
            return 'Buổi tối';
        default:
            return time;
    }
};

const styles = StyleSheet.create({
    container: {
        padding: 25,
        paddingTop: 55,
        backgroundColor: Colors.WHITE,
        height: '100%',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerText: {
        fontFamily: 'outfitBold',
        fontSize: 35,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.WHITE,
    },
    destinationText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    tripHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
    },
    dayContainer: {
        marginBottom: 10,
    },
    dayHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.GRAY,
        backgroundColor: Colors.LIGHT_GRAY,
        borderBottomWidth: 1,
        borderBottomColor: Colors.GRAY,
    },
    dayText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    detailsContainer: {
        paddingLeft: 20,
    },
    timeContainer: {
        marginBottom: 5,
    },
    timeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 5,
    },
    timeText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    activityDetails: {
        marginLeft: 10,
        marginTop: 5,
    },
    detailText: {
        fontSize: 14,
    },
    diningDetails: {
        marginTop: 5,
    },
    diningName: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    diningImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginVertical: 5,
    },
    attractionDetails: {
        marginTop: 5,
    },
    attractionName: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    attractionImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginVertical: 5,
    },
    hotelDetails: {
        marginTop: 5,
    },
    hotelName: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    hotelInfo: {
        fontSize: 14,
    },
});