import React from "react";
import EncryptedStorage from 'react-native-encrypted-storage';

//本地数据库的一些方法

export async function storeUserSession(key, value) {
  try {
      await EncryptedStorage.setItem(key, value);
  } catch (error) {
      console.log(error)
  }
}

export async function removeUserSession(key) {
  try {
      await EncryptedStorage.removeItem(key);
      // Congrats! You've just removed your first value!
  } catch (error) {
      // There was an error on the native side
  }
}

export async function clearStorage() {
  try {
      await EncryptedStorage.clear();
      // Congrats! You've just cleared the device storage!
  } catch (error) {
      // There was an error on the native side
  }
}

export async function retrieveUserInfo(key) {
  try {   
      const session = await EncryptedStorage.getItem(key);
      if (session !== undefined) {
          return session.toString()
      }
  } catch (error) {
      console.log(error)
  }
}

export async function retrievePreferTask() {
  try {   
      const session = await EncryptedStorage.getItem("preferTask");
      if (session !== undefined) {
        return session?.split(",")          
      }
  } catch (error) {
      console.log(error)
  }
}