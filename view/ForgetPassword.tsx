import React, { useState } from "react";
import { View, StyleSheet, Button, Alert,Text } from "react-native";
import { Input } from "@rneui/themed";
import { get, getDatabase, ref, update,set } from "firebase/database";
import app from "../db/dbConfig";
import IonIcons from 'react-native-vector-icons/Ionicons'
const database = getDatabase(app);

const ChangePassword = ({navigation}) => {
  const [newPassword, setNewpassword] = useState("");
  const [confirmPassword, setConfirmpassword] = useState("");
  const [phone, setPhone] = useState("");
 
const setPhoneNumber = (value) => {
    setPhone(value)
}
const setNewPassword = (value) => {
    setNewpassword(value)
}
const setConfirmPassword = (value) => {
    setConfirmpassword(value)
}
const handleSubmit1 = ( ) => {
    if(newPassword.length !== 6)
    {
        setNewpassword("");
        Alert.alert("Error", "Invalid password! Please enter a six-digit password!");
    }
    else
    {
        setNewpassword(newPassword);
    }
}
const handleSubmit2 = async( ) => {
    const phoneRegex = /^(13[0-9]|14[01456879]|15[0-3,5-9]|16[2567]|17[0-8]|18[0-9]|19[0-3,5-9])\d{8}$/;
        const isValidPhone = phoneRegex.test(phone);
        if (!isValidPhone) {
            setPhone("");
            Alert.alert("Error", "Invalid phone number! Please enter a valid phone number.");
        } 
        else
        {
            const resultRef = ref(database, `users/${phone}`)
            const snapshot = await get(resultRef)
            if(snapshot.exists()){
            setPhone(phone);
            }
            else
            {
                Alert.alert("This account has not been registered yet, please register first.","")
                navigation.goBack()
            }
            
        }
}

  const handlePasswordChange = () => {
    if (newPassword === confirmPassword) {
        if(phone!=""&&newPassword!=""&&confirmPassword!="")
        {
            update(ref(database, 'users/' + phone), {
            'password': newPassword
    }).then(()=>{
        alert("Change Success!")
        navigation.goBack()
    });
    }
    else
    {
        Alert.alert("Error", "Please enter password");
    }
      
    } else {
      Alert.alert("Error", "Invalid password. Please enter same password");
    }
  };
  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
       <View style={styles.header}>
        <IonIcons
          name="arrow-back"
          size={30}
          onPress={handleGoBack}
          style={styles.backButton}
        />
         <Text style={styles.title}>Back</Text>
      </View>
    <Input
        leftIcon={<IonIcons name="call-outline" size={25}></IonIcons>}
        placeholder="Please enter your phone"
        value={phone}
        onChangeText={setPhoneNumber}
        onBlur={handleSubmit2}
      />
      <Input
         inputContainerStyle = {{marginBottom:0}}
         leftIcon={<IonIcons name="lock-closed-outline" size={25}></IonIcons>}
         placeholder="Please enter your password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        onBlur={handleSubmit1}
      />
      <Input
        inputContainerStyle = {{marginBottom:0}}
        leftIcon={<IonIcons name="lock-closed-outline" size={25}></IonIcons>}
        placeholder="Please enter your password again"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <Button title="Change Password" onPress={handlePasswordChange} />
    </View>
  );
};


const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
    },
    backButton: {
      marginRight: 10,
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
    },
  });

export default ChangePassword;
