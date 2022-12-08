import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView, Linking, Button, View, Alert} from 'react-native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer,Link } from "@react-navigation/native";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase/firebase-setup";
import React, { useState, useEffect } from "react";

import Colors from "./components/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons'; 
import { FontAwesome } from '@expo/vector-icons'; 

import Log from "./screens/auth/Log";
import Signup from "./screens/auth/Signup";


import EventDetailPage from "./components/EventDetailPage";

// import Camera from "./screens/cameraPosting/Camera";

import CameraScreen from "./screens/cameraPosting/CameraScreen";
import CameraNextStepPage from "./screens/cameraPosting/CameraNextStepPage";
import FindEventPage from "./screens/cameraPosting/FindEventPage";

import DashboardScreen from "./screens/userDashboard/DashboardScreen";
import CreateEventPage from "./screens/userDashboard/CreateEventPage";
import PostHistoryPage from "./screens/userDashboard/PostHistoryPage";
import EventHistoryPage from "./screens/userDashboard/EventHistoryPage";
import ChooseTimePage from "./screens/userDashboard/ChooseTimePage";
import ChoosePositionPage from "./screens/userDashboard/ChoosePositionPage";
import ManageEventPage from "./screens/userDashboard/ManageEventPage";

import TipIcon from './components/TipIcon';
import MapScreen from './screens/map/MapScreen';

import * as Notifications from "expo-notifications";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: true,
    };
  },
});

function MajorScreens() {
  return (
    <Tab.Navigator
        screenOptions={({navigation})=>({
        headerTintColor: Colors.pink,
        tabBarStyle: { backgroundColor: Colors.white,
       },
        tabBarActiveTintColor: Colors.yellow,
      })}
    >
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          title: "Map",
          headerShown:false,
          tabBarIcon: ({ color, size }) => (
            <Feather name="map-pin" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Camera"
        component={CameraScreen}
        options={{
          title: "Camera",
          headerShown:false,
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="camerao" size={size} color={color} />
          ),
        }}
      />

    <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={/* ({ navigation }) => */ {
          /* return { */
            title: "Dashboard",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="user-circle-o" size={size} color={color} />
            ),
            headerRight: () => {
  
              return  <AntDesign name="logout" style={{ marginRight: 30 }} size={24} color={Colors.pink} onPress={() =>{
                Alert.alert("Are you sure")
                
                signOut(auth)}}/> 
         
             
            },
    
        }}
      />
    </Tab.Navigator>
  );

}

export default function App() {
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsUserAuthenticated(true);
      } else {
        setIsUserAuthenticated(false);
      }
    });
  });

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      (notificaftion) => {
        console.log("notification received ", notificaftion);
      }
    );
    const subscription2 = Notifications.addNotificationResponseReceivedListener(
      async (notificationResponse) => {
        console.log(
          "notification interacted ",
          notificationResponse.notification.request.content.data
        );
        if (notificationResponse.notification.request.content.data.url) {
          try {
            await Linking.openURL(
              notificationResponse.notification.request.content.data.url
            );
          } catch (err) {
            console.log(err);
          }
        }
      }
    );
    return () => {
      subscription.remove();
      subscription2.remove();
    };
  });
  
  const AuthStack = (
    <>
      <Stack.Screen name="Log" options={{headerShown:false}} component={Log} />
      <Stack.Screen name="Signup" options={{headerShown:false}} component={Signup} />
    </>
  );

  const AppStack = (
    <>
        <Stack.Screen
            name="MajorScreens"
            component={MajorScreens}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CameraNextStepPage"
            component={CameraNextStepPage}
            options={{title:'Create a post'}}
          />
           <Stack.Screen
            name="ChoosePositionPage"
            component={ChoosePositionPage}
            options={{title:'Choose Position'}}
          />
          <Stack.Screen
            name="ChooseTimePage"
            component={ChooseTimePage}
            options={{title:'Choose Time'}}
          />
          <Stack.Screen
            name="CreateEventPage"
            component={CreateEventPage}
            options={{title:'Create Event'}}
          />
          <Stack.Screen
            name="ManageEventPage"
            component={ManageEventPage}
            options={{title:'Manage Event'}}
          />
          <Stack.Screen
            name="EventDetailPage"
            component={EventDetailPage}
            options={{title:'Event Detail',
           /*  headerRight:()=>(<TipIcon size={24} color={"white"} onPress={()=>{}}
            />), */
          }}
          />
           <Stack.Screen
            name="EventHistoryPage"
            component={EventHistoryPage}
            options={{title:'Event History'}}
          />

          <Stack.Screen
            name="FindEventPage"
            component={FindEventPage}
            options={{title:'Find Event'}}
          />
          <Stack.Screen
            name="PostHistoryPage"
            component={PostHistoryPage}
            options={{title:'Post History'}}
          />



    </>
  );

  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  return (

      <NavigationContainer>
   
        <Stack.Navigator
      screenOptions={{
        headerTintColor: Colors.pink 
/*         headerStyle: {
          backgroundColor: Colors.backgroundYellow
        }, */
       }}
        >   

          {isUserAuthenticated ? AppStack : AuthStack}

        </Stack.Navigator>
  
      </NavigationContainer>

  );

  
}

const styles = StyleSheet.create({
/*   tabBar: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  }, */
logout:{
  margin:5,
  padding:5
} 
});
