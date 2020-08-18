import { createStackNavigator } from "@react-navigation/stack";
import AdminHome from "../src/MainScreen/Admin/AdminHome";
import React from 'react';
import ManagerUser from "../src/MainScreen/Admin/ManagerUser";
import BlockChallenge from "../src/MainScreen/Admin/BlockChallenge";
import CompanyDetails from "../src/MainScreen/Admin/CompanyDetails";
import Report from "../src/MainScreen/Admin/Report";
import { Icon } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import { NavigationActions } from "react-navigation";
const AdminStack = createStackNavigator()


const AdminStackScreen = ({navigation}) =>(
    <AdminStack.Navigator
    screenOptions={{
        headerTintColor:'white',
        headerStyle:{
            backgroundColor:'#8e2de2',
            // borderBottomLeftRadius:25,
            // borderBottomRightRadius:25,
        },
        headerTitleAlign:'center'
    
    }}
    >
        <AdminStack.Screen name="Admin Dashboard" component={AdminHome} options={{
                headerLeft:() => (
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon type="material" name="home" size={30} color="white" style={{paddingLeft:15}} />
                    </TouchableOpacity>
                )
        }}/>
        <AdminStack.Screen name="Manage User" component={ManagerUser}/>
        <AdminStack.Screen name="Block Challenge" component={BlockChallenge}/>
        <AdminStack.Screen name="Company Details" component={CompanyDetails}/>
        <AdminStack.Screen name="Report" component={Report}/>
    </AdminStack.Navigator>
)

export default AdminStackScreen;