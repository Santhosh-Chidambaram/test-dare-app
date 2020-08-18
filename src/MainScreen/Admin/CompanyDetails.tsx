import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import AdminContainer from './components/AdminContainer'

const CompanyDetails = () => {
    return (
        <AdminContainer>
            <View style={styles.cd}>
                <View style={styles.logo}>
                    <Text>Logo</Text>
                </View>

                <View style={styles.labelView}>
                <Text style={styles.label}>Name</Text>
                <Text style={styles.value}>dasdas</Text>     
                </View>

                <View style={styles.labelView}>
                <Text style={styles.label}>Address</Text>
                <Text style={styles.value}>fafa</Text>     
                </View>

                <View style={styles.labelView}>
                <Text style={styles.label}>website</Text>
                <Text style={styles.value}>wb.com</Text>     
                </View>
                
            </View>
            
        </AdminContainer>
    )
}

export default CompanyDetails

const styles = StyleSheet.create({
    cd:{
        flex:1,
        alignItems:'center'
    },
    logo:{
        backgroundColor:'white',
        padding:20,
        height:90,
        width:90,
        borderRadius:50,
        marginVertical:15,
        justifyContent:'center',
        alignItems:'center'
    },
    labelView:{
        marginVertical:15
    },
    label:{
        fontSize:26,
        fontWeight:'bold',
        textAlign:'center'
    },
    value:{
        fontSize:20,
        color:'white',
        textAlign:'center'
    }
})
