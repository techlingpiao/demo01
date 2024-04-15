//设置界面
import { ListItem, Button } from "@rneui/base";
import { Avatar } from "@rneui/themed";
import * as React from "react";
import { useState } from "react";
import { Alert } from "react-native";
import { View,StyleSheet } from "react-native";
import EncryptedStorage from 'react-native-encrypted-storage';
import IonIcons from 'react-native-vector-icons/Ionicons'
import { clearStorage } from "../db/session";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Prefer from "./Prefer";
import ChangePassword from "./ChangePassword";

const SettingsView = ({navigation}) => {
    const styles = StyleSheet.create({
        container: {
            margin:20,
        },
    })

    const [name, setName] = useState("");
    
    async function retrieveUserInfo() {
        try {   
            const session = await EncryptedStorage.getItem("name");
            if (session !== undefined) {
                setName(session)             
            }else{
                // navigation.navigate('login')
            }
        } catch (error) {
            console.log(error)
        }
    }
    retrieveUserInfo();
    
    const logout = () => {
        Alert.alert(
            'Log out',
            'Are your sure you want to log out?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },{
                    text: 'OK',
                    onPress: () => {
                        navigation.navigate('login')
                        clearStorage();
                    },
                },
            ],
        )
    }

    const handleChangePassword = () => {
        navigation.navigate("changePassword")
    }

    const handlePreference = () => {
        navigation.navigate('prefer')
    }

    const Stack = createNativeStackNavigator();
    const Settings = ()=>{
        return (
            <View style={styles.container}>
                <ListItem bottomDivider>
                    <Avatar rounded icon={{
                            name: "person-outline",
                            type: "material",
                            size: 35,
                        }}
                        containerStyle={{ backgroundColor: "#c2c2c2" }}/>
                    <ListItem.Content>
                        <ListItem.Title style={{ fontSize:28, fontWeight: "bold" }}>{name}</ListItem.Title>
                    </ListItem.Content>
                </ListItem>
                {/* TODO 修改密码功能 */}
                <ListItem bottomDivider onPress={handleChangePassword}>
                    <ListItem.Content>
                    <ListItem.Title >Change Password</ListItem.Title>
                    </ListItem.Content>
                    <ListItem.Chevron />
                </ListItem>
                <ListItem onPress={handlePreference}>
                    <ListItem.Content>
                    <ListItem.Title>Preference Settings</ListItem.Title>
                    </ListItem.Content>
                    <ListItem.Chevron />
                </ListItem>
                <Button buttonStyle={{width:"100%", marginTop:30}} title="Log out" onPress={logout}></Button>
            </View>
        )
    }

    return (
        <Stack.Navigator initialRouteName="settings2" screenOptions={{headerTitleAlign: "center"}}>
            <Stack.Screen name="settings2" component={Settings} options={{headerShown: false}}/>
            <Stack.Screen name="prefer" component={Prefer} />
            <Stack.Screen name="changePassword" component={ChangePassword}/>
        </Stack.Navigator>
    )
}

export default SettingsView
