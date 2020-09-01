import React, { useContext, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,Dimensions
} from "react-native";
import { WebView } from "react-native-webview";
import {Icon} from 'react-native-elements'
import LinearGradient from 'react-native-linear-gradient';
import '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import { API_KEY } from "../../constants";
import MainContext from "../../MainContext/MainContext";
import Leaderboard from './Leaderboard'


function ParticipationItem({ item,likeList,likeChallenge,user_id }) {
  let likeslength = likeList.filter(l => Object.keys(l).includes(item.id))
 
  return (
    <View style={styles.participationItem}>
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
        style={{
          width: 186,
         
        }}
        javaScriptEnabled={true}
        source={{ uri: "https://www.youtube.com/embed/" + item.id}}
      />
      
       
        <View style={{padding:2,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
      
            <TouchableOpacity  delayPressIn={1} style={styles.share}>
                <Icon type="entypo" name="share" size={28} color="black" />
                </TouchableOpacity>
                
                <TouchableOpacity  
                style={{flexDirection:'row',alignItems:'center'}} 
                onPress={() => likeChallenge(item.id)}>
                  <Text style={{fontSize:18,paddingRight:10}}>{likeslength.length > 0 ? likeslength[0][item.id] : '0'}</Text>
                {
                  likeslength[0]['likedMembers'].includes(user_id)?
                  <Icon type="antdesign" name="heart" size={28} color="red" />:
                  <Icon type="antdesign" name="heart" size={28} color="#cecece" />
                }
                </TouchableOpacity>


  

        </View>
        
      
    </LinearGradient>
    </View>
  );
}

const Participation = ({ navigation,route }) => {
  const {challengeID} = route.params;
  const mainContext = useContext(MainContext)
  const {token,user_id} = mainContext
  const [vlist, setVlist] = useState([]);
  const [likeList,setLikeList] = useState('')
  const [docId,setDocId] = useState('')
  const ref = firestore().collection('dares')
  const [participantList,setParticipantList] = useState([])

  



  

  const fetchData = (clist) =>{

    try {
      fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${clist}&key=${API_KEY}`,{
        headers:{
          Authorization: "Bearer "+token,
          Accept: "application/json"
        }
      })
      .then(res => res.json())
      .then(data => {
          if(data.items){
            setVlist(data.items)
             console.log(data)
          }
      })
    } catch (error) {
        console.log(error)
    }
      
  }


  useEffect(() => {

    const subscriber = ref.onSnapshot(querySnapShot =>{
        querySnapShot.forEach(doc =>{
          const {videoId} = doc.data()
          if(challengeID === videoId){
            let list = '';
            let likes = []
            setDocId(doc.id)
            const { participants} = doc.data();
            if(participants){
              setParticipantList(participants)
              participants.forEach(p =>{
                    list+=(p.videoId+",")
      
                     if(p.likes){
                       likes.push({[p.videoId]:p.likes.length,'likedMembers':p.likes})
                     }
      
                    })
                    
              }

              let clist = list.slice(0,-1)+'';
              console.log(clist)
              setLikeList(likes)
             if(clist){
              fetchData(clist)
             }

          }
        })
    })
    
   


   return() => subscriber()
    
   
  
  
  },[]);

  const likeChallenge = async (vidId) =>{
    try {
      ref.doc(docId).get()
    .then(async (querySnap) =>{
        const { participants } = querySnap.data()
        if(participants){
            let temp_participants = participants.map(participant =>{
              if(participant.likes){
                 if(participant.videoId === vidId){
                  if(participant.likes.includes(user_id)){
                    participant.likes = participant.likes.filter(l => l != user_id)
                  }else{
                    participant.likes = [...participant.likes,user_id]
                 
                  }
                  
                  return participant
                 }else{
                   return participant
                 }
              }else{
                participant.likes = [user_id]
                return participant
              }
            })
            
           
            await ref.doc(docId).update({
            "participants":temp_participants
            })
        }
    })
    } catch (error) {
      console.log(error)
    }
  }

 
  return (
    <View style={styles.container}>
     <View style={{flex:1}}>
      <Leaderboard plist={participantList}/>
      </View> 
    
    <View style={{flex:3}}>
     {
       vlist != ''?
       <FlatList
       numColumns={2}
       data={vlist}
       renderItem={({ item }) => <ParticipationItem item={item} likeList={likeList} likeChallenge={likeChallenge} user_id={user_id}/>}
       keyExtractor={(item) => item.id}
      
     />
     :
     <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
     <Text style={{color:'black',fontSize:19,fontWeight:'bold'}}>No Participated videos yet</Text>
     </View>
     }
     </View>

    <View style={styles.createView}>
      <TouchableOpacity
         
         onPress={() => navigation.navigate("Upload Video",{docId:docId})}
         delayPressIn={1}
       >
            <LinearGradient 
            colors={["#6E45E1", "#66a6ff"]} 
         
            style={styles.createDare}
            >
                <Text style={{color:'white',fontSize:20,fontWeight:'bold'}}>Accept Challenge</Text>
            </LinearGradient>
                
          
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Participation;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    flex: 1,
    backgroundColor:'white'
  },
  challHead: {
    marginVertical: 20,
  },
  challText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  participationItem: {
  
    flexDirection: "column",
    marginVertical:5,
    marginHorizontal: 5,
    width: Dimensions.get('window').width/2.1,
    height: 180,
    backgroundColor: "#cecece",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  share: {
    paddingRight:5
  },
  accept: {
    backgroundColor:'white',
    padding:5
  },
  createView: {
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  createDare: {
    justifyContent: "flex-end",
    alignItems: "center",

    backgroundColor: "#1cefff",
    width: 200,
    padding: 10,
    borderRadius: 20,
  },
});
