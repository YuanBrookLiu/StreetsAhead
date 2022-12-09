import { View, Text, FlatList, StyleSheet, Pressable, Alert, ImageBackground, SafeAreaView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { firestore, auth } from "../firebase/firebase-setup";
import { deleteEventFromDB } from "../firebase/firestore";
import { doc, collection, onSnapshot, query, where, documentId } from "firebase/firestore";
import PostItem from './PostItem';
import TipIcon from "./TipIcon";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { deviceHeight, deviceWidth, moderateScale } from "../styles/responsive";
import Colors from './Colors';

export default function EventDetailPage({ route, navigation }) {

  const [event, setEvent] = useState();

  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState()
  const [posts, setPosts] = useState([]);
  function onEditEvent() {
    navigation.navigate("ManageEventPage", {
      eventId: route.params.eventId
    });
  }
  const onDeleteEvent = async () => {
    Alert.alert(
      "Important",
      "Are you sure you want to delete this event?",
      [
        {
          text: "No",
          onPress: () => { },
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              await deleteEventFromDB(route.params.eventId);
              navigation.goBack();
              Alert.alert("Success","Successfully deleted!")
            } catch (err) {
              console.log(err);
            }
          },
        },
      ]
    );

  }
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(firestore, "events", route.params.eventId),
      (doc) => {
        setEvent(doc.data());

      },
      (err) => {
        console.log(err);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    //console.log(route.params.isManagable);
    const uns = onSnapshot(
      query(
        collection(firestore, "posts"),
        where("linkedEventId", "==", route.params.eventId)
      ),
      (querySnapshot) => {
        if (querySnapshot.empty) {
          setPosts([]);
          return;
        }
        setPosts(
          querySnapshot.docs.map((snapDoc) => {
            let data = snapDoc.data();
            data = { ...data, key: snapDoc.id };
            return data;
          })
        );
      },
      (err) => {
        console.log(err);
      }
    );

    return () => {
      uns();
    };
  }, []);
  let isEventExist = false;

  if (event != undefined) {
    isEventExist = true;
  }
  let isPostExist = false;
  if (posts != []) {
    isPostExist = true;
  }

  useEffect(() => {
    if (event) {
      const startTimeStamp = event.startTime.seconds * 1000 + event.startTime.nanoseconds / 1000000;
      const startTimeObject = new Date(startTimeStamp);
      const endTimeStamp = event.endTime.seconds * 1000 + event.endTime.nanoseconds / 1000000;
      const endTimeObject = new Date(endTimeStamp);
      const monthNames = ["JAN. ", "FEB. ", "MAR. ", "APR. ", "MAY ", "JUN. ",
                            "JUL. ", "AUG. ", "SEPT. ", "OCT. ", "NOV. ", "DEC. "];
      setStartTime(startTimeObject.getHours() + " : " + startTimeObject.getMinutes());
      setStartDate(monthNames[endTimeObject.getMonth()] + startTimeObject.getDate());
      setEndDate(monthNames[endTimeObject.getMonth()] + endTimeObject.getDate());
      setEndTime(endTimeObject.getHours() + " : " + endTimeObject.getMinutes());
    }
  }, [event]);

  return (
    <View style={styles.container}>
      {isPostExist &&
        <View style={styles.postList}>
          <FlatList
            ListHeaderComponent={
              <View>
                {isEventExist &&
                  <ImageBackground source={require("../assets/images/ticket.png")} style={{ height:deviceHeight/ 1.5}}>
                    <TipIcon/>
                    <View style={styles.infos}>
                      <Text style={styles.title}>{event.eventName}</Text>
                      <Text style={styles.text}>Performers: {event.performer}</Text>
                      <View style={styles.timeBar}>
                        <View style={styles.timeWrap}>
                          <Text style={styles.timeText}>{startTime}</Text>
                          <Text style={styles.timeText}>{endTime}</Text>
                        </View>
                        <View style={styles.dateWrap}>
                          <Text style={styles.dateText}>{startDate}</Text>
                          <Text style={styles.dateText}>{endDate}</Text>
                        </View>
                      </View>
                    </View>
                    {route.params.isManagable &&
                  <View style={styles.buttonsContainer}>
                    <Pressable 
                      style={({ pressed }) => pressed?styles.pressed:styles.management}
                      onPress={onEditEvent}><MaterialCommunityIcons name="data-matrix-edit" size={30} color={Colors.pink} />
                    <Text style={styles.manageText}>Edit Event</Text>
                    </Pressable>
                    <Pressable 
                     style={({ pressed }) => pressed?styles.pressed:styles.management}
                    onPress={onDeleteEvent}><MaterialIcons name="delete-forever" size={30} color={Colors.pink} />
                    <Text style={styles.manageText}>Delete Event</Text>
                    </Pressable>
                  </View>
                }
                  </ImageBackground>}


              </View>
            }
            data={posts}
            renderItem={({ item }) => {
              return (
                <PostItem
                  post={item}
                  option={1}
                />
              );
            }}
          ></FlatList>
        </View>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    backgroundColor: Colors.blue,
  },
  title: {
    textAlign: "center",
    fontSize: moderateScale(40),
    padding: moderateScale(5),
    fontWeight: "bold",
    bottom:moderateScale(80),
    marginBottom: moderateScale(5),
    color:Colors.pink,
    position:"relative"
  },
  text: {
    textAlign: 'center',
    // alignContent:"center",
    bottom:moderateScale(70),
    fontSize:moderateScale(25),
    color:Colors.white,
  },
  timeBar: {
    bottom:moderateScale(60),
    height: deviceHeight / 7,
    width: deviceWidth / 1.5,
    borderRadius: 10,
    backgroundColor: "white",
    alignSelf: 'center',
    marginBottom: moderateScale(20),
    marginTop: moderateScale(20),
  },
  timeWrap: {
    marginTop: moderateScale(20),
    padding:moderateScale(10),
    alignItems: "stretch",
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  timeText: {
    top:moderateScale(0),
    fontSize: moderateScale(30),
  },
  dateText:{
    fontSize:moderateScale(20),
    color:"gray"
  },
  dateWrap: {
    padding: moderateScale(10),
    alignItems: "stretch",
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  buttonsContainer: {
    height: deviceHeight / 8,
    width: deviceWidth / 1.5,
    backgroundColor:Colors.green,
    alignSelf: 'center',
    marginTop:moderateScale(60),
    justifyContent: "space-around",
    flexDirection: 'row',
    bottom:30,
  },
  infos: {
    marginTop: moderateScale(100),
    marginHorizontal: 30,
    marginVertical: 10

  },
  postList: {
    marginVertical: 20,
    alignItems: 'center',
  },
  management:{
    alignItems:"center",
    backgroundColor:Colors.green,
    width:100,
    paddingVertical:10,
    borderRadius:10

  },
  manageText:{
    color:Colors.pink
  },
  pressed:{
    opacity: 0.5,
    alignItems:"center",
    backgroundColor:Colors.backgroundYellow,
    width:100,
    paddingVertical:10,
    borderRadius:10
  }
});