import React, { useState } from 'react'
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Icon,SearchBar } from 'react-native-elements'
import LinearGradient from 'react-native-linear-gradient'
import { connect } from 'react-redux'
import { clearSearch, searchChallenge } from '../../actions/ChallengeActions'
const ChallengeHeader = (props) => {
    const [showSearch,setShowSearch] = useState(false)
    const [search,setSearch] = useState('')

    const changeHandler = (txt) =>{
        setSearch(txt)
        setTimeout(() =>{
                props.setFiltered(search)
        },5000)
    }
    return (
        <View style={styles.header}>
            <StatusBar backgroundColor="#66a6ff"/>
          
            {
                !showSearch?
                <View style={styles.titleView}>
                    <Text style={styles.title}>{props.title}</Text>
                </View>
                :
                <View style={styles.titleView}>
                     <SearchBar
                        lightTheme
                        placeholder="Search Challenge"
                        onChangeText={txt => changeHandler(txt)}
                        value={search}
                        containerStyle={{
                            backgroundColor:'#66a6ff'
                        }}
                        inputContainerStyle={{
                            backgroundColor:'white',
                            height:40,
                            alignItems:'center'
                        }}
                        onCancel={props.clearFiltered}
                    />    
                </View>
            }
            <View style={styles.action}>
                {
                    showSearch?
                    <TouchableOpacity onPress={() => setShowSearch(!showSearch)}>
                    <Icon name="clear" type="material" color="white"/>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity onPress={() => setShowSearch(!showSearch)}>
                    <Icon name="search" type="material" color="white"/>
                    </TouchableOpacity>
                }
               
                <TouchableOpacity onPress={() => props.navigation.openDrawer()}>
                    <Icon name="menu" type="material" color="white"/>
                </TouchableOpacity>
            </View>
            
            
        </View>
    )
}


function mapStateToProps(state){
    return{
      
    }
  }
  
  function mapDispatchToProps(dispatch){
    return{
        setFiltered:(query) => dispatch(searchChallenge(query)),
        clearFiltered:() => dispatch(clearSearch()),
    }
  }
  
export default connect(mapStateToProps,mapDispatchToProps)(ChallengeHeader)

const styles = StyleSheet.create({
    header:{
        flexDirection:'row',
        alignItems:'center',
        height:50,
        backgroundColor:'#66a6ff'

    },
    title:{
        fontSize:19,
        color:'white',
        fontWeight:'bold',
        textAlign:'center'
    },
    titleView:{

        width:'75%'

    },
    action:{
        width:'25%',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-around',
    }
})
