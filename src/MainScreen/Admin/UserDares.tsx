import React,{useState,useEffect, useContext} from 'react'
import { StyleSheet, View,FlatList,TouchableOpacity, Dimensions } from 'react-native'
import firestore from '@react-native-firebase/firestore';
import AdminContainer from './components/AdminContainer';
import '@react-native-firebase/app';
import {Button,Avatar,Text,Icon} from 'react-native-elements'
import LinearGradient from 'react-native-linear-gradient';
import { WebView } from "react-native-webview";
import MainContext from '../../MainContext/MainContext';
import { API_KEY } from '../../constants';


function ChallengeItem({ item}) {
  
    return (
      <View
      style={styles.challengeItem}    
    >
      <LinearGradient 
      colors={["#89f7fe", "#66a6ff"]} 
      style={{
          position:'absolute',
          top:0,
          left:0,
          right:0,
          bottom:0
      }}
      >
          <WebView 
          javaScriptEnabled={true}
          source={{ uri: "https://www.youtube.com/embed/" + item.id }}
        />
        
         
          <View style={{padding:5,flexDirection:'row',justifyContent:'space-between',alignItems:'center',borderBottomLeftRadius:20}}>
              <View style={{flexDirection:'row'}}>
              {/* <TouchableOpacity  delayPressIn={1} style={styles.share}>
                  <Icon type="entypo" name="share" size={28} color="black" />
                  </TouchableOpacity>
                  <TouchableOpacity  delayPressIn={1}>
                  <Icon type="antdesign" name="heart" size={28} color="#cecece" />
                  </TouchableOpacity> */}
              </View>
  
             
  
          </View>
          
        
      </LinearGradient>
      </View>
    );
  }
  
const DareItem = ({item}) =>{
    return(
        <View style={styles.userCard}>
                        <View style={styles.cardLeft}>
                            <Text style={styles.label}>Dare Name : <Text>{item.title}</Text></Text>
                            <Text style={styles.label}>User Type : <Text>{item.tag}</Text></Text>
                            <Text style={styles.label}>Created on : <Text>{item.created_on}</Text></Text>
                        </View>

                        <View style={styles.cardRight}>
                        {/* <Button
                        title={item.isBlocked?"Unblock":"Block"}
                        buttonStyle={[styles.btnStyle,{backgroundColor:item.isBlocked?"#2F80ED":"red"}]}
                        titleStyle={styles.btnText}

                        onPress={() =>{
                            if(item.isBlocked){
                                editDare(item.videoId,false)
                            }else{
                                editDare(item.videoId,true)
                            }
                        }}
                        /> */}
                        </View>
        </View>
    )
}

const UserDares = ({route,navigation}) => {
    const {user_id} = route.params;
    const dareRef = firestore().collection('dares');
    const [dareList,setDareList] = useState()
    const mainContext = useContext(MainContext)
    const {token} = mainContext

    const fetchData = (clist) =>{
        console.log("set")
        try {
          fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${clist}&key=${API_KEY}`,{
            headers:{
              Authorization: "Bearer "+token,
              Accept: "application/json"
            }
          })
          .then(res =>  res.json())
          .then(data => {
              setDareList(data.items)
              
          })
        } catch (error) {
            console.log(error)
        }
          
      }
    
      
    useEffect(() =>{
        dareRef.get()
        .then(querySnapshot => {
            let dlist=[]
            let list = '';
            querySnapshot.forEach(doc => {
                const {participants,created_by,title,end_date,start_date,videoId} = doc.data()
                if(created_by === user_id){
                    dlist.push({
                        title:title,
                        tag:'creator',
                        created_on:start_date?start_date:'',
                        videoId:videoId

                    })
                    list+=(videoId+",")
                }
                if(participants && participants.length > 0){
                    participants.forEach(p =>{
                        
                        if(p.participant_id === user_id){
                            list+=(p.videoId+",")
                               dlist.push({
                                title:title,
                                tag:'participant',
                                created_on:start_date?start_date:'',
                                videoId:p.videoId
                               }) 
                        }
                    })
                }
            });

            // setDareList(dlist);
            let clist = list.slice(0,-1)+'';
            console.log(clist)
            
            if(clist) fetchData(clist)
            
          });

          
    },[])
    return (
        <AdminContainer>
         
            <FlatList 
                numColumns={2}
                data={dareList}
                renderItem={({item,index}) => <ChallengeItem item={item}   />}
                keyExtractor={(item) => item.id}
                />

         
        </AdminContainer>
    )
}

export default UserDares

const styles = StyleSheet.create({
    userCard:{
        flex:1,
        flexDirection:'row',
        backgroundColor:'white',
        marginVertical:10,
        marginHorizontal:10,
        padding:15,
        borderRadius:20
    },
    cardLeft:{
        flex:1,
        justifyContent:'center'
    },
    cardRight:{
        flex:1/2,
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
    label:{
        fontSize:18,
        fontWeight:'bold',
        marginBottom:5
    },
    challengeItem: {
   
        flexDirection: "column",
        marginVertical:5,
        marginHorizontal: 5,
        width: Dimensions.get('window').width/2.1,
        height: 180,
        backgroundColor: "#cecece",
        justifyContent: "center",
        alignItems: "center",
        borderBottomLeftRadius:20
      },
      share: {
        paddingRight:5
      },
})
