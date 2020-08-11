import React from 'react'
import MainContext from './MainContext'
import MainReducer from './MainReducer'


const MainState = (props) =>{

    const initialState = {
        token:'',
        username:'',
        email:'',
        pic_url:'',
        isRegisterd:false,
        videoUri:''

    }

    const [state,dispatch] = React.useReducer(MainReducer,initialState)


    const setUserDetails = (detail) =>{
        console.log(detail)
        dispatch({type:'SET_USER_DETAILS',payload:detail})

    }

    const setVideoUri = (uri) =>{
        dispatch({type:'SET_VIDEO_URI',payload:uri})
    }


    return(
        <MainContext.Provider value={{
            token:state.token,
            username:state.username,
            isRegistered:state.isRegistered,
            pic_url:state.pic_url,
            email:state.email,
            videoUri:state.videoUri,


            setUserDetails,
            setVideoUri

        }}>
            {props.children}
        </MainContext.Provider>
    )

}


export default MainState;