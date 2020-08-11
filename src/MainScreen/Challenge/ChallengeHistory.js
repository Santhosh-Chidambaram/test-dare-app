import React,{useEffect,useRef,useState,useContext} from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import { WebView } from "react-native-webview";
import {Icon} from 'react-native-elements'
import LinearGradient from 'react-native-linear-gradient';
import { API_KEY } from '../../constants';

import '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import MainContext from '../../MainContext/MainContext';



function ChallengeItem({ item, navigation }) {
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
            <TouchableOpacity  delayPressIn={1} style={styles.share}>
                <Icon type="entypo" name="share" size={28} color="black" />
                </TouchableOpacity>
                <TouchableOpacity  delayPressIn={1}>
                <Icon type="antdesign" name="heart" size={28} color="#cecece" />
                </TouchableOpacity>
            </View>

            <View>
            <TouchableOpacity
                style={styles.accept}
                delayPressIn={0.5}
                onPress={() => navigation.navigate("Accept Challenge",{challengeID:item.id})}
            >
 
                <Text style={{backgroundColor:'white',color:'black'}}>Accept</Text>
         
                
                </TouchableOpacity>

            </View>

        </View>
        
      
    </LinearGradient>
    </View>
  );
}

const ChallengeHistory = ({ navigation,screenProps }) => {
    const [vlist,setVlist] = React.useState([])
    const mainContext = useContext(MainContext)
    const {token} = mainContext
    const ref = firestore().collection('dares');


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
            setVlist(data.items)
            console.log(data)
        })
      } catch (error) {
          console.log(error)
      }
        
    }

  
    
    useEffect(() => {
      const unsubricbeListener = ref.onSnapshot(querySnapshot => {
        let list = '';
        querySnapshot.forEach(doc => {
          const { videoId } = doc.data();
          list+=(videoId+",")
        });
        let clist = list.slice(0,-1)+'';
        console.log(clist)
        //fetchData(clist)
        
      });
      
      return () => unsubricbeListener()

    }, []);
  
  return (
    <View style={styles.container}>
      <FlatList
        numColumns={2}
        data={vlist}
        renderItem={({ item }) => (
          <ChallengeItem item={item} navigation={navigation} />
        )}
        keyExtractor={(item) => item.id}
      />

      <View style={styles.createView}>
      <TouchableOpacity
         
         onPress={() => navigation.navigate("Upload Video")}
         delayPressIn={1}
       >
            <LinearGradient 
            colors={["#6E45E1", "#66a6ff"]} 
            
            style={styles.createDare}
            >
                <Text style={{color:'white',fontSize:20,fontWeight:'bold'}}>Create Dare</Text>
            </LinearGradient>
                
          
        </TouchableOpacity>
      </View>
    </View>
  );
};


export default ChallengeHistory;



const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    flex: 1,
    backgroundColor: "white",
    paddingTop:10,
    paddingLeft:8,
    paddingRight:8
  },
  challHead: {},
  challText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },

  challengeItem: {
    
    flexDirection: "column",
    margin: 10,
    width: 175,
    height: 180,
    backgroundColor: "#cecece",
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius:20
  },
  share: {
    paddingRight:5
  },
  accept: {
    backgroundColor:'white',
    padding:5,
    borderRadius:10
  },
  createView: {
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  createDare: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1cefff",
    width: 200,
    padding: 10,
    borderRadius: 20,
  },
});
