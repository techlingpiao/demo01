import React, { useState } from "react";
import { View, StyleSheet, Alert, } from "react-native";
import { get, getDatabase, ref, update } from "firebase/database";
import { Button, Dialog, Input, Text } from "@rneui/themed";
import IonIcons from 'react-native-vector-icons/Ionicons'
import app from "../db/dbConfig";
import { updateAssignedTask } from "../db/InitializeDB";

const database = getDatabase(app);

const Register = ({navigation}) => {
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
        lastInput:{
            width: "100%",
            alignItems:'center',
            height: 50,
            paddingHorizontal:0,
            marginBottom:25,
        }
    })

    const [phone,setPhone] = useState("")
    const [name,setName] = useState("")
    const [password,setPassword] = useState("")
    const [password2, setPassword2] = useState("");
    const [load,setLoad] = useState(false)

    const handlePhoneChange = (value) => {
        setPhone(value)
    }
    const handleNameChange = (value) => {
        setName(value)
    }
    const handlePasswordChange1 = (value) => {
        setPassword(value);
    }
    const handlePasswordChange2 = (value) => {
        setPassword2(value);
        
    }
    const handleSubmit = ( ) => {
        const phoneRegex = /^(13[0-9]|14[01456879]|15[0-3,5-9]|16[2567]|17[0-8]|18[0-9]|19[0-3,5-9])\d{8}$/;
        const isValidPhone = phoneRegex.test(phone);
        if (!isValidPhone) {
            setPhone("");
            Alert.alert("Error", "Invalid phone number! Please enter a valid phone number.");
        } 
        else
        {
            setPhone(phone);
        }
    }
    
    const handleSubmit1 = ( ) => {
        if(password.length !== 6)
        {
            setPassword("");
            Alert.alert("Error", "Invalid password! Please enter a six-digit password!");
        }
        else
        {
            setPassword(password);
        }
    }
   

    

    const register = async () => {
            if (name == ""){
                setName(phone)
            }
            
            if(password2!== password)
            {
                setPassword("");
                Alert.alert("Error", "Invalid password. Please enter same password");
                setLoad(false)
            }
            else if(password2==password)
            {
                setPassword(password);
            }
            
            if(password==""||phone=="")
            {
                        Alert.alert("Error", "Please Check Your Phone or Password");
                        setLoad(false)
            }
            else
                    {    
                        const result = ref(database, `users/${phone}`)
                        const snapshot = await get(result)
                        const typeSnapshot = await get(ref(database, 'taskType'))
                        if(snapshot.exists()){
                            Alert.alert('The account has been set up.',"")
                            
                        }else
                        {
                            update(ref(database, 'users/' + phone), {
                                'name': name,
                                'password': password,
                                'totalTask': 0,
                                'todayTask': "",
                                'preferTask':typeSnapshot.val(),
                            }).then(()=>{
                                updateAssignedTask(phone)
                                setLoad(true)
                                alert("Your account has been set up!")
                                navigation.goBack()
                            });
                        }
                        
                    }
            }
            
                   
    

    return (
        <View style={styles.container}>
            <Text h2 style={{marginBottom: 30}}>Clockin</Text>
            <View style={styles.formCon}>
                <Input 
                // TODO 手机格式验证
                //手机输入框
                    containerStyle = {styles.inputCon}
                    leftIcon={<IonIcons name="call-outline" size={25}></IonIcons>}
                    placeholder="Please enter your phone"
                    onChangeText={handlePhoneChange}
                    onBlur={handleSubmit}
                ></Input>
                <Input 
                // 名字输入框
                    containerStyle = {styles.inputCon}
                    leftIcon={<IonIcons name="person-outline" size={25}></IonIcons>}
                    placeholder="Please enter your name"
                    onChangeText={handleNameChange}
                ></Input>
                <Input 
                // TODO 密码格式验证
                //密码输入框
                    containerStyle = {styles.inputCon}
                    leftIcon={<IonIcons name="lock-closed-outline" size={25}></IonIcons>}
                    placeholder="Please enter your password"
                    secureTextEntry={true}
                    onChangeText={handlePasswordChange1}
                    onBlur={handleSubmit1}
                ></Input>
                <Input 
                // 密码确认框
                // TODO 两次密码是否相同的验证
                    containerStyle = {styles.lastInput}
                    leftIcon={<IonIcons name="lock-closed" size={25}></IonIcons>}
                    placeholder="Please enter your password again"
                    secureTextEntry={true}
                    onChangeText={handlePasswordChange2}
                    //onBlur={handleSubmit2}
                ></Input>
                <Button buttonStyle={{width:"100%"}} title="Register" onPress={register}></Button>
                <Button type="clear" 
                    title="Already have an account? Log in!" 
                    onPress={()=>{navigation.goBack()}}
                ></Button>
                <Dialog isVisible={load} >
                    <Dialog.Title title="Please wait..." titleStyle={{textAlign:'center',fontSize:18}}></Dialog.Title>
                    <Dialog.Loading/>
                </Dialog>
            </View>
        </View>
    )
}

export default Register
