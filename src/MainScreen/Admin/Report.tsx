import React,{useState,useEffect} from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import AdminContainer from './components/AdminContainer'
import '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';

const ReportItem = ({item}) =>{
    return(
        <View style={styles.reportItem}>
            <Text style={styles.reportText}>{item.title}</Text>
        </View>
    )
}










const Report = () => {
    const dareRef = firestore().collection('dares');
    const [dareList,setDareList] = useState()

    useEffect(() =>{
        const unsubricbeListener = dareRef.onSnapshot(querySnapshot => {
            let dlist=[]
            querySnapshot.forEach(doc => {
              dlist.push(doc.data())
            });

            setDareList(dlist);
  
            
          });

          return () => unsubricbeListener()
    },[])


    return (
        <AdminContainer>
            <View style={styles.container}>
            
            <View style={styles.contenLeft}>
                <View style={styles.title}>
                    <Text style={styles.titleText}>Running Challenges</Text>
                </View>
                <View>
                    <FlatList 
                    data={dareList}
                    keyExtractor={item => item.videoId}
                    renderItem={ReportItem}
                    />
                </View>
            </View>
            <View style={styles.contenRight}>
                <View style={styles.title}>
                    <Text style={styles.titleText}>Completed Challenges</Text>
                </View>
                <View>
                    {/* <FlatList 
                    data={dareList}
                    keyExtractor={item => item.videoId}
                    renderItem={ReportItem}
                    /> */}
                </View>
            </View> 
            
            </View>   
        </AdminContainer>
    )
}

export default Report

const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'row',
        padding:5
    },
    contenLeft:{
        flex:1,
        alignItems:'center',
        padding:5,
       
    },
    contenRight:{
        flex:1,
        alignItems:'center',
        padding:5,
      
    },
    title:{
        backgroundColor:'white',
        width:150,
        height:60,
        padding:5,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:20,
        marginVertical:10,
    },
    titleText:{
        fontSize:17,
        fontWeight:'bold',
        textAlign:'center',
    },
    reportItem:{
        backgroundColor:'white',
        minHeight:50,
        marginVertical:10,
        alignItems:'center',
        justifyContent:'center',
        padding:10,
    },
    reportText:{
        fontSize:16,
        
    }

})
