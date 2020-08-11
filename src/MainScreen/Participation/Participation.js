import React, { useContext, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { WebView } from "react-native-webview";
import {Icon} from 'react-native-elements'
import LinearGradient from 'react-native-linear-gradient';
import '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import { API_KEY } from "../../constants";
import MainContext from "../../MainContext/MainContext";



function ParticipationItem({ item }) {
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
                <TouchableOpacity  delayPressIn={1}>
                <Icon type="antdesign" name="heart" size={28} color="#cecece" />
                </TouchableOpacity>


  

        </View>
        
      
    </LinearGradient>
    </View>
  );
}

const Participation = ({ navigation,route }) => {
  const {challengeID} = route.params;
  console.log(challengeID)

  const mainContext = useContext(MainContext)
  const {token} = mainContext
  const [vlist, setVlist] = useState([]);
  const [docId,setDocId] = useState('')
  const ref = firestore().collection('dares')


  const getDocumentId = () =>{
    ref.where("videoId","==",challengeID)
    .get()
    .then(querySnapShot =>{
      querySnapShot.forEach(doc =>{
        setDocId(doc.id)
        console.log(doc.id)
      
      })
    })
  }
 





  

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

    getDocumentId()

    if(docId){
      ref.doc(docId).collection('participants')
      .get()
      .then(querySnapshot => {
        let list = '';
        querySnapshot.forEach(doc => {
          const { videoId } = doc.data();
          list+=(videoId+",")
        });
        let clist = list.slice(0,-1)+'';
        console.log(clist)
        fetchData(clist)
      })

    }
  }, [docId]);

  return (
    <View style={styles.container}>
      {/* <View style={styles.challHead}>
                <Text style={styles.challText}>Participation</Text>
            </View> */}

    <View style={{height:600}}>
     {
       vlist != ''?
       <FlatList
       numColumns={2}
       data={vlist}
       renderItem={({ item }) => <ParticipationItem item={item} />}
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
         
         onPress={() => navigation.navigate("Upload Video")}
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
    margin: 10,
    width: 175,
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
