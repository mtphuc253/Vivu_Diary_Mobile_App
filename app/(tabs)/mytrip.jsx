import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '../../constants/Colors'
import StarNewTripCard from '../../components/MyTrips/StarNewTripCard'

export default function MyTrip() {

  const [userTrips, setUserTrips] = useState([])

  return (
    <View style={{
      padding: 25,
      paddingTop: 55,
      backgroundColor: Colors.WHITE,
      height: '100%',

    }}>
      <View style={{
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'space-between'
      }}>
        <Text style={{
          fontFamily: 'outfitBold',
          fontSize: 35
        }}>Chuyến đi của tôi</Text>
      </View>


      {
        userTrips?.length == 0 ?
          <StarNewTripCard />
          : null
      }

    </View>
  )
}