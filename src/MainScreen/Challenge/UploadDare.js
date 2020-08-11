import React, { useContext, useState,useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator
} from "react-native";
import { Input,Icon } from "react-native-elements";
import '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import LinearGradient from 'react-native-linear-gradient';
import DocumentPicker from 'react-native-document-picker';
import {MediaUploader} from '../../../utils/MediaUploader'
import MainContext from "../../MainContext/MainContext";
import { ProgressBar, Colors } from 'react-native-paper';
import RNVideoEditor from 'react-native-video-editor';
import RNFetchBlob from 'react-native-fetch-blob'



const UploadDare = ({ navigation }) => {

  //Context 

  const mainContext = useContext(MainContext)
  const {token} = mainContext;

  //Video States
  const [videoName,setVideoName] = useState('')
  const [selectedUri,setSelectedUri] = useState('')

  //Upload Field States

  const [title,setTitle] = useState('')
  const [description,setDescription] = useState('')
  const [tag,setTag] = useState('')

  //Upload Progress States

  const [showProgress,setShowProgress] = useState(false)
  const [total,setTotal] = useState()
  
  //Response State
  let videoArr = []

  const dareRef = firestore().collection('dares');
  let snip;
  const showToast = (res) => {
    ToastAndroid.showWithGravityAndOffset(
      res,
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50
    );
  };
  
  const uploadDoucment = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.video],
      });
     console.log(res.uri) 
     console.log((await RNFetchBlob.fs.stat(res.uri)).filename)


    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
        console.log("canceled")
      } else {
        console.log(err)
      }
    }
    
  }

  const uploadVideoToYoutube = async () =>{
    setShowProgress(true)
    const file = await fetch(selectedUri); 
    const file_blob = await file.blob();
    console.log(file_blob)
    setShowProgress(true)
    let tagarr = ["DareU2k20"]
    tagarr.push("DareU2k20"+tag)

    try {
       var metadata = {
           snippet: {
             title: "DareU2k20 "+title,
             description: description,
             tag:tagarr,
             categoryId: 22,
           },
           status: {
             privacyStatus: "public",
             embeddable: true,
             license: "youtube",
           },
         };
         var uploader = new MediaUploader({
           baseUrl: "https://www.googleapis.com/upload/youtube/v3/videos",
           file: file_blob,
           token: token,
           metadata: metadata,
           id: 0,
           params: {
             part: Object.keys(metadata).join(","),
           },
     
           onError: function (data) {
             console.log("error", data);
             showToast("Error Uploading Video")
             setShowProgress(false)
             // onError code
           }.bind(this),
           onProgress: function (data) {
             let average = parseInt(data.loaded)/parseInt(data.total)
             setTotal(average)
             console.log("Progress", data);
             // onProgress code
           }.bind(this),
           onComplete: function (data) {
              
              setShowProgress(false)
              showToast("Your Video Has Been Successfully Uploaded To Youtube")

             // onComplete code
             let responseJson = JSON.parse(data)
             uploadVideoIdToDB(responseJson.id,responseJson.etag,responseJson.snippet.title,responseJson.snippet.description)

           }.bind(this),
         });
         uploader.upload();
         
   
 }catch(error){
   console.log(error)

 }
  }

  

  const uploadVideoIdToDB = async (id,etag,title,desc) =>{
    try {
      
      await dareRef.add({
       
        videoId:id,
        etag:etag,
        title:title,
        desc:desc
      })
      
      console.log("Added To DB")
    } catch (error) {
        console.log(error)
    }

  }

  const sampleCheck = () =>{
    console.log(videoArr)
    try {
      RNVideoEditor.merge(
        [selectedUri,selectedUri],
        (results) => {
          console.log('Error: ' + results);
        },
        (results, file) => {
          console.log('Success : ' + results + " file: " + file);
        }
      );
    } catch (error) {
        console.log(error)
    }
  }
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#6E45E1", "#66a6ff"]}
        
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }}
      />
      {
        showProgress?
        <View style={{marginBottom:20}}>  
          <ActivityIndicator size="large" color="#00ff00" animating={true}/>
          <Text style={styles.labelStyle}>Please wait your video is being uploaded</Text>
          <ProgressBar progress={total} color={Colors.greenA400} />
        </View>
      :
      null
      }
      
      <View style={styles.uploadView}>
        <TouchableOpacity
          style={[styles.upload,{marginRight:10}]}
          onPress={() => navigation.navigate("Camera")}
        >
          <Icon type="material-community" name="video" size={44} color="white" />
          <Text style={{ color: "white" }}>Record Video</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.upload}
          onPress={() => uploadDoucment()}
        >
          <Icon type="material" name="file-upload" size={44} color="white" />
          <Text style={{ color: "white" }}>Select Video</Text>
        </TouchableOpacity>
      </View>

      <View>
        <Input
          label="Title"
          labelStyle={styles.labelStyle}
          inputStyle={styles.inputStyle}
          value={title}
          onChangeText={txt => setTitle(txt)}
        />
        <Input
          label="Description"
          labelStyle={styles.labelStyle}
          inputStyle={styles.inputStyle}
          value={description}
          onChangeText={txt => setDescription(txt)}
        />
        <Input
          label="Tag"
          labelStyle={styles.labelStyle}
          inputStyle={styles.inputStyle}
          value={tag}
          onChangeText={txt => setTag(txt)}
        />
      </View>
      <View style={{marginBottom:20}}>
          <Text style={styles.labelStyle}>File Name :</Text>
          <Text style={{textAlign:'center',color:'white',fontWeight:'bold',marginTop:10}}>{videoName?videoName:'No File Selected'}</Text>
      </View>
      

      <TouchableOpacity
        style={styles.uploadBtn}
        onPress={() => {
          // if(title  && description  && tag && videoName ){
          //   uploadVideoToYoutube()
         
          // }else{
          //   showToast("Please Fill All the Fields then press upload")
          // }
          sampleCheck()
        }}
      >
        <Text style={{ color: "black", fontSize: 20 }}>Upload</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UploadDare;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    height: Dimensions.get("window").height,
    padding: 20,
  },
  uploadView: {
    flexDirection:'row',
    justifyContent: "center",
    alignItems: "center",
  },
  upload: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f64f59",
    width: 100,
    height: 100,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { height: 0, width: 1 },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 5,
  },
  labelStyle: {
    color: "white",
    fontSize: 18,
    fontWeight:'bold'
  },
  inputStyle: {
    borderBottomWidth: 2,
    borderColor: "white",
    color: "white",
  },
  uploadBtn: {
    backgroundColor: "#40E0D0",
    justifyContent: "center",
    alignItems: "center",
    height: 45,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { height: 0, width: 1 },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 5,
  },
});
