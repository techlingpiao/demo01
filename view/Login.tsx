//登录界面
import React, { useState } from "react";
import { View, StyleSheet, Alert} from "react-native";
import { get, getDatabase, ref, } from "firebase/database";
import { Button, Input, Text,CheckBox } from "@rneui/themed";
import IonIcons from 'react-native-vector-icons/Ionicons'
import app from "../db/dbConfig";
import { storeUserSession } from "../db/session";
import EncryptedStorage from "react-native-encrypted-storage";


const database = getDatabase(app);

const Login = ({navigation}) => {
    const styles = StyleSheet.create({
        container: {
            marginTop:"40%",
            alignItems:'center',
        },
        formCon:{
            marginLeft: "10%",
            marginRight: "10%",
        },
        inputCon: {
            width: "100%",
            alignItems:'center',
            height: 50,
            paddingHorizontal:0,
            marginBottom:5
        },
    })

    const [phone,setPhone] = useState("")
    const [password,setPassword] = useState("")
    const [checked, setChecked] = useState(false)
    const handlePhoneChange = (value) => {
        setPhone(value)
    }
    const handlePasswordChange = (value) => {
        setPassword(value)
    }

    //从本地保存的数据中取出remember选项
    async function retrieveUserInfo() {
        try {   
            const session = await EncryptedStorage.getItem("remember");
            if (session !== undefined) {
                if(session == "true"){
                    console.log(session)
                    navigation.navigate("app")
                }else{
                    navigation.navigate("login")
                }
            }           
        } catch (error) {
            console.log(error)
        }
    }
    retrieveUserInfo();

    const login = async () => {
        const resultRef = ref(database, `users/${phone}`)
        const snapshot = await get(resultRef)
        if(snapshot.exists()){
            const dbPws = snapshot.val()['password']
            if (dbPws == password){
                //设置本地数据库中的一些user数据（键值对形式）
                storeUserSession("phone", phone)
                storeUserSession("name", snapshot.val()['name'])
                storeUserSession("todayTask", snapshot.val()['todayTask'].toString())
                if (checked){
                    storeUserSession("remember", "true")
                }else{
                    storeUserSession("remember", "false")
                }
                //跳转到"app"界面
                navigation.navigate('app')
            }else{
                Alert.alert('The password is wrong. Please enter again.',"")
            }
        }else{
            Alert.alert("This account has not been registered yet, please register first.","")
        }            
    }

    return (
        <View style={styles.container}>
            <Text h2 style={{marginBottom: 30}}>Clockin</Text>
            <View style={styles.formCon}>
                <Input 
                    containerStyle = {styles.inputCon}
                    leftIcon={<IonIcons name="call-outline" size={25}></IonIcons>}
                    placeholder="Please enter your phone"
                    onChangeText={handlePhoneChange}
                ></Input>
                <Input 
                    containerStyle = {styles.inputCon}
                    inputContainerStyle = {{marginBottom:0}}
                    leftIcon={<IonIcons name="lock-closed-outline" size={25}></IonIcons>}
                    placeholder="Please enter your password"
                    secureTextEntry={true}
                    onChangeText={handlePasswordChange}
                ></Input>
                <View style={{flexDirection: 'row', alignContent:'center', marginBottom:15}}>
                    <CheckBox checked={checked} title='remember me' onPress={() => setChecked(!checked)}
                        iconType="material-community"
                        checkedIcon="checkbox-outline"
                        uncheckedIcon={'checkbox-blank-outline'}
                        containerStyle={{backgroundColor:"",padding:0, marginLeft: 0, marginTop:0, marginRight:'auto'}}
                    ></CheckBox>
                    {/* TODO 忘记密码功能 */}
                    <Button 
                    type="clear" 
                    size={"sm"}
                    title="forgetPassword?" 
                    onPress={()=>{navigation.navigate('forget')}}
                    buttonStyle={{ padding:0, margin:0, alignSelf:'flex-end'}}
                    ></Button>
                </View>
                <Button buttonStyle={{width:"100%"}} title="Log in" onPress={login}></Button>
                <Button type="clear" 
                    title="Don't have an account? Sign up now!" 
                    onPress={()=>{navigation.navigate('register')}}
                ></Button>
            </View>
        </View>
    )
}

export default Login
