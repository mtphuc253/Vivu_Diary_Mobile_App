import { View, Text } from 'react-native'
import React from 'react'
import { Colors } from '../../constants/Colors'

export default function OptionCard({ option, selectedOption }) {
  return (
    <View style={[{
      padding: 25,
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: Colors.LIGHT_GREY,
      borderRadius: 15
    }, selectedOption?.id==option?.id && {borderWidth: 3}]}>
      <View>
        <Text style={{
          fontSize: 20,
          fontFamily: 'outfitBold'
        }}>
          {option?.title}
        </Text>

        <Text style={{
          paddingLeft: 0,
          fontSize: 17,
          fontFamily: 'outfitMedium',
          color: Colors.GREY
        }}>
          {option?.desc}
        </Text>
      </View>
      <Text style={{
        fontSize: 35,
        fontFamily: 'outfitMedium',
        color: Colors.GREY
      }}>
        {option?.icon}
      </Text>
    </View>
  )
}