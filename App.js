
import React,{useEffect} from 'react';
import {TouchableOpacity} from 'react-native'
import { StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'
import { Icon } from 'react-native-elements';
//Navigators
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import {createDrawerNavigator} from '@react-navigation/drawer'
import {createAppContainer, createSwitchNavigator} from 'react-navigation'

//Screens
import Signin from './src/AuthScreen/Signin'
import DareRules from './src/MainScreen/DareRules';

import DrawerContent from './src/DrawerContent'
import SplashScreen from './src/SplashScreen';
import '@react-native-firebase/app';
import ChallengeHistory from './src/MainScreen/Challenge/ChallengeHistory';
import UserProfile from './src/MainScreen/Profile/UserProfile';
import Participation from './src/MainScreen/Participation/Participation';
import UploadDare from './src/MainScreen/Challenge/UploadDare';
import CameraScreen from './src/MainScreen/CameraScreen';
//Create Stacks for Navigation
const SideDrawer = createDrawerNavigator()
const MainStack = createStackNavigator()

const MainStackScreen = ({navigation}) =>(
  <MainStack.Navigator
  screenOptions={{
    headerTitleAlign:'center',
      headerRight:() => <TouchableOpacity delayPressIn={0.3} onPress={() => navigation.openDrawer()}><Icon name="menu" type="material-community" size={28} color="black" style={{marginRight:10}}/></TouchableOpacity>
    

  }}

  >
    <MainStack.Screen name="Challenge History" component={ChallengeHistory} /> 
    <MainStack.Screen name="User Profile" component={UserProfile} /> 
    <MainStack.Screen name="Accept Challenge" component={Participation} /> 
    <MainStack.Screen name="Dare Rules" component={DareRules} />
    <MainStack.Screen name="Upload Video" component={UploadDare} />  
    <MainStack.Screen name="Camera" component={CameraScreen} options={{headerShown:false}}/>  
  </MainStack.Navigator>
)

const SideDrawerSreen = () => (
  <NavigationContainer>
  <SideDrawer.Navigator drawerContent={props => <DrawerContent {...props} />} drawerPosition="right">
        
        <SideDrawer.Screen name="Home" component={MainStackScreen}/>
        <SideDrawer.Screen name="Profile" component={UserProfile}/>

    </SideDrawer.Navigator>
  </NavigationContainer>
)

const App = createSwitchNavigator({
  Splash:{
    screen:SplashScreen,
    navigationOptions:{
      headerShown:false,
    },
  },
  Signin:{
    screen:Signin,

  },
  HomeScreen:{
    screen:SideDrawerSreen,
    navigationOptions:{
      headerShown:false
    }
  }

})
  
export default createAppContainer(App)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
});
