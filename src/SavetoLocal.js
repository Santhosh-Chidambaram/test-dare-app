import AsyncStorage from '@react-native-community/async-storage'

export async function _saveData(key,data) {
    try {
        await AsyncStorage.setItem(key,JSON.stringify(data))
        console.log("saved")    
    } catch (error) {
        console.log(error)
    }
    
    
}

export async function _getData(key) {
    try {
        var value = AsyncStorage.getItem(key)
        return value
    } catch (error) {
        console.log(error)
    }
}