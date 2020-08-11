
const MainReducer = (state,action) =>{
    switch(action.type){
        case 'SET_USER_DETAILS':
            return {
                ...state,
                token:action.payload['accessToken'],
                username:action.payload.username,
                email:action.payload.email,
                pic_url:action.payload.pic_url,
                isRegisterd:true,
            }
        case 'SET_VIDEO_URI':
            return{
                ...state,
                videoUri:action.payload
            }
        
        default:
            return state
    }

}

export default MainReducer