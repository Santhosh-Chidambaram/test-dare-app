import React, { useContext } from 'react'
import { StyleSheet, Text, View,Image, Dimensions,TouchableOpacity,StatusBar } from 'react-native'
import {
    GoogleSignin,
    GoogleSigninButton,
  } from '@react-native-community/google-signin';


import {GoogleSocialButton} from 'react-native-social-buttons'
import AsyncStorage from '@react-native-community/async-storage'
import LinearGradient from 'react-native-linear-gradient';
import {_saveData} from '../SavetoLocal'
import auth from '@react-native-firebase/auth';
import MainContext from '../MainContext/MainContext';



const Signin = (props) => {
    const mainContext = useContext(MainContext)
    const {setUserDetails} = mainContext
    
    React.useEffect(() =>{
        try {
            GoogleSignin.configure({
                scopes:[
                    // 'https://www.googleapis.com/auth/drive.readonly',
                    'https://www.googleapis.com/auth/youtube',
                    'https://www.googleapis.com/auth/youtube.upload',
                    'https://www.googleapis.com/auth/plus.login',
                    ],
                webClientId: "574168900168-rmib931altviqe7nv9625bm7roagkhk9.apps.googleusercontent.com",
                forceConsentPrompt: false,
                 // if you want to show the authorization prompt at each login
                 //ZjvNbJapxZyvNMCIVvs9EUIF
            });
            
        } catch (error) {
            console.log(error)
            
        }
       
    },[])

    const googleSignInHandler = async() => {
        GoogleSignin.hasPlayServices()
        .then(res => {
            GoogleSignin.signIn()
            .then(async(res) => {
                const sign = await GoogleSignin.getTokens()


                // Create a Google credential with the token
                const googleCredential = auth.GoogleAuthProvider.credential(sign['idToken']);
               
                // Sign-in the user with the credential
                const result = await auth().signInWithCredential(googleCredential)                
                const {user} = result;
                let userState = {
                    username :user.displayName,
                    email:user.email,
                    pic_url:user.photoURL,
                    accessToken:sign['accessToken']
                } 
                setUserDetails(userState)
                _saveData('userDetails',JSON.stringify(userState)) 
               
                props.navigation.navigate('HomeScreen')
                
            })
            .catch(error => {
                console.log(error.code);
            });
            
        })
        .catch(err => {
            console.log(err);
        });
    }
    return (
        <View style={styles.container}>
             <StatusBar backgroundColor="#6E45E1" />
            <LinearGradient
            // Background Linear Gradient
            
            colors={[ '#6E45E1','#66a6ff']}
            
            style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                height: Dimensions.get('screen').height,
              }}
            />
            <View style={styles.headerLogo}>
                <View style={styles.logo}> 
                <Image source={require('../../assets/splash.png')}  style={styles.logo}/>
                </View>

                <View style={styles.btnView}>
        
                {/* <GoogleSigninButton
                    style={{ width: 48, height: 48 }}
                    size={GoogleSigninButton.Size.Icon}
                    color={GoogleSigninButton.Color.Dark}
                    onPress={googleSignInHandler}
                    
                /> */}
                <GoogleSocialButton
                buttonViewStyle={styles.btnStyle}
                logoStyle={styles.logoStyle}
                textStyle={styles.signinTxt}
                onPress={googleSignInHandler}
                />                
                </View>
            
            </View>

            

        </View>
        
    )
}

export default Signin

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#fff'
    },
    headerLogo:{
        flex:1,
        justifyContent:'flex-start',
        alignItems:'center',
       
    },
    logo:{
        marginVertical:28,
        width:Dimensions.get('screen').width-150,
        height:230
    },
    btnView:{
        
        marginVertical:30,
        
    },
    btnStyle:{

        height:50,
        width:270,
        shadowColor:'#000',
        shadowOffset:{height:0,width:1},
        shadowOpacity:1,
        shadowRadius:5,
        elevation:5

    },
    signinTxt:{
        fontSize:20,
        color:'black'
    },
    logoStyle:{
        height:30,
        width:30
    },
    footer:{
        justifyContent:'flex-end',
        alignItems:'center',
        marginBottom:25
    },
    emailBtn:{
        flexDirection:'row',
        alignItems:'center',
    },
    emailText:{
        fontSize:18,
        paddingLeft:8,
        color:'gray'
    },
    registerView:{
        marginVertical:10,
        flexDirection:'row'
    },
    registerText1:{
        color:'gray'
    },
    registerInlineText:{
        color:'#4286f4'
    }
})
