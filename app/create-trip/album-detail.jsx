import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function AlbumDetail({ route }) {
    const { tripName, tripPlace, album } = route.params; // Nhận tham số từ route
    const [showFullStatus, setShowFullStatus] = useState(false);

    const toggleStatusView = () => {
        setShowFullStatus(!showFullStatus);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.tripName}>{tripName}</Text>
            <Text style={styles.tripPlace}>{tripPlace}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {album.albumImgs.map((img, index) => (
                    <Image key={index} source={{ uri: img.imgUrl }} style={styles.albumImage} />
                ))}
            </ScrollView>
            <View style={styles.statusContainer}>
                <Text style={styles.albumStatus} numberOfLines={showFullStatus ? undefined : 2}>
                    {album.albumStatus}
                </Text>
                <TouchableOpacity onPress={toggleStatusView}>
                    <Text style={styles.toggleButton}>
                        {showFullStatus ? 'Rút gọn' : 'Xem thêm'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    tripName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    tripPlace: {
        fontSize: 16,
        color: '#777',
        marginBottom: 20,
    },
    albumImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginRight: 10,
    },
    statusContainer: {
        marginTop: 20,
    },
    albumStatus: {
        fontSize: 14,
        color: '#555',
    },
    toggleButton: {
        color: '#007BFF',
        marginTop: 6,
    },
});
