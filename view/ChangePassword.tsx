import React, { useState } from "react";
import { View, StyleSheet, Button, Alert } from "react-native";
import { Input } from "@rneui/themed";
import { get, getDatabase, ref, update,set } from "firebase/database";
import app from "../db/dbConfig";
import { retrieveUserInfo } from '../db/session';
import EncryptedStorage from 'react-native-encrypted-storage';
import IonIcons from 'react-native-vector-icons/Ionicons'
const database = getDatabase(app);

const ChangePassword = ({navigation}) => {
  const [newPassword, setNewpassword] = useState("");
  const [confirmPassword, setConfirmpassword] = useState("");
  const [phone, setPhone] = useState("");
  async function retrieveUserInfo() {
    try {   
        const session = await EncryptedStorage.getItem("phone");
        console.log(session);
        setPhone(session);
    } catch (error) {
        console.log(error)
    }
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

retrieveUserInfo();
  const handlePasswordChange = () => {
    if (newPassword === confirmPassword) {
       update(ref(database, 'users/' + phone), {
        'password': newPassword
    }).then(()=>{
        alert("Change Success!")
        navigation.goBack()
    });
    } else {
      Alert.alert("Error", "Invalid password. Please enter same password");
      console.log("Don't Match");
    }
  };

  return (
    <View style={styles.container}>
      <Input
        inputContainerStyle = {{marginBottom:0}}
        leftIcon={<IonIcons name="lock-closed-outline" size={25}></IonIcons>}
        placeholder="Please enter your password "
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
});

export default ChangePassword;
