
import React, { useState } from 'react';
// import * as FileSystem from 'expo-file-system';
import { equalTo, getDatabase, onValue, orderByChild, push, query, ref, set } from "firebase/database";
import app from "../db/dbConfig";

const database = getDatabase(app);
const postListRef = ref(database, 'tasks');
 
  export const readAndUploadFile = async (line) => {
    const newPostRef = push(postListRef);
    await set(newPostRef, {
        title: line, 
        type: "lifestyle and self-care"
    });        
  };

export const updateAssignedTask = (userid) =>{
  onValue(postListRef, (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const childKey = childSnapshot.key;
      const taskRef = ref(database, 'assignedTask/' + userid+'/'+ childKey);
      set(taskRef, false).then(()=>{})
    });
  });
}

export const getUnfinishedTask = (userid) =>{
  let taskList = []
  const assignedTaskRef = ref(database, 'assignedTask/'+ userid)
  onValue(assignedTaskRef, (snapshot2)=>{
    snapshot2.forEach((childSnapshot)=>{
      if(childSnapshot.val() == false){
        taskList.push(childSnapshot.key)
      }
    })
    return taskList
  },{onlyOnce:true})
}