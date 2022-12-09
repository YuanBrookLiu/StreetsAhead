import { View, Text,Pressable,StyleSheet } from 'react-native'
import React from 'react'
import Colors from '../../components/Colors';
import EventList from '../../components/EventList';

export default function EventHistoryPage({route,navigation}) {
  function eventPressed() {
    navigation.navigate("ManageEventPage");
  }
  return (
    <View style={styles.container}>
      <View style={styles.list}>
      <EventList isAll={false}/>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    backgroundColor: Colors.blue,
  },
  list:{
    height:  "100%",
   
  },
  pressed: {
    opacity: 0.75,
  },
});