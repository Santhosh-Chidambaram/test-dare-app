import React,{useEffect, useState} from 'react'
import {  FlatList, StyleSheet, View } from 'react-native'
import AdminContainer from './components/AdminContainer'
import '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import {Button,Avatar,Text} from 'react-native-elements'

const UserItem = ({item,i,editUser}) =>{
    return(
        <View style={styles.userCard}>
                <View style={styles.cardLeft}>
                <Avatar
                rounded
                size="large"
                icon={{name: 'user', type: 'font-awesome'}}
                onPress={() => console.log("Works!")}
                activeOpacity={0.7}
                containerStyle={{backgroundColor:'grey'}}
                />
                </View>
                <View style={styles.cardRight}>
                        <View>
                            <Text style={{fontSize:20,fontWeight:'bold'}}>{item.username}</Text>
                        </View>

                        <View style={styles.actionView}>
                        <Button
                        title="Block"
                        buttonStyle={[styles.btnStyle,{backgroundColor:'red'}]}
                        titleStyle={styles.btnText}
                        disabled={item.isBlocked}
                        onPress={() =>{editUser(item.user_id,true)}}
                        />

                        <Button
                        title="Reactive"
                        buttonStyle={[styles.btnStyle,{backgroundColor:'#2F80ED'}]}
                        titleStyle={styles.btnText}
                        disabled={!item.isBlocked}
                        onPress={() =>{editUser(item.user_id,false)}}
                        />

                        </View>
                        

                </View>
        </View>
    )
}



const ManagerUser = () => {
    const userRef = firestore().collection('users');
    const [userList,setUserList] = useState()
    useEffect(() =>{
        const unsubricbeListener = userRef.onSnapshot(querySnapshot => {
            let ulist=[]
            querySnapshot.forEach(doc => {
              ulist.push(doc.data())
            });

            setUserList(ulist);
  
            
          });

          return () => unsubricbeListener()
    },[])

    const editUser = (user_id,block) =>{
        const res = userRef
        .where("user_id", "==", user_id)
        .get()
        .then(querySnapshot => {
            
            const docId = querySnapshot.docs[0].id
            userRef.doc(docId).update({
                isBlocked:block
            })
        })
        
    }
    return (
        <AdminContainer>
            <View style={{flex:1,padding:10}}>
            <FlatList 
                data={userList}
                renderItem={({item,index}) => <UserItem item={item} i={index} editUser={editUser} />}
                keyExtractor={(item) => item.user_id}
                />
            </View>
                
        </AdminContainer>
    )
}

export default ManagerUser

const styles = StyleSheet.create({
    userCard:{
        flex:1,
        flexDirection:'row',
        backgroundColor:'white',
        marginVertical:10,
        padding:15,
        borderRadius:20
    },
    cardLeft:{
        flex:1/4,
        justifyContent:'center'
    },
    cardRight:{
        flex:1,
        marginLeft:20
    },
    actionView:{
        paddingTop:10,
        flexDirection:'row',
        justifyContent:'flex-start'
    },
    btnStyle:{
        marginRight:15,
        width:90
    },
    btnText:{
        fontSize:18
    },
 

})
