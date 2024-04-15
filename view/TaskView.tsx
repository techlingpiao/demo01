//选择任务界面
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { Card, Text } from '@rneui/themed';
import Swipe from "react-native-deck-swiper";
import { retrieveUserInfo } from "../db/session";
import app from "../db/dbConfig";
import { get, getDatabase, ref, update } from "firebase/database";

export default function TaskView({ onSendValue }) {
  // TODO 增加背景渐变

  const getValue = (index) => {
    onSendValue(index)
  }

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      marginTop: '20%'
    },
  })

  const [load, setLoad] = useState(true);
  const [taskList, setTaskList] = useState([]); // Store taskList in state
  const database = getDatabase(app)

  const getTask = async () => {
    try {
      const data = await retrieveUserInfo("phone");
      const taskListt = [];
      const assignedTaskRef = ref(database, 'assignedTask/' + data);
      const snapshot2 = await get(assignedTaskRef);
  
      snapshot2.forEach((childSnapshot) => {
        if (childSnapshot.val() == false) {
          taskListt.push(childSnapshot.key);
        }
      });
  
      if (taskListt.length > 20) {
        let idList = [];
        const tasksPromises = [];
  
        for (let i = 0; i <= 20; i++) {
          let taskid = taskListt[Math.floor(Math.random() * taskListt.length)];
          while (idList.includes(taskid)) {
            taskid = taskListt[Math.floor(Math.random() * taskListt.length)];
          }
          idList.push(taskid);
  
          const taskCountRef = ref(database, 'tasks/' + taskid);
          const taskSnapshot = await get(taskCountRef);
          const task = {
            id: taskSnapshot.key,
            title: taskSnapshot.val()["title"]
          };
  
          tasksPromises.push(task);
        }
  
        const tasks = await Promise.all(tasksPromises);
        setTaskList(tasks);
      } else {
        const tasksPromises = taskListt.map((taskid) => {
          const taskCountRef = ref(database, 'tasks/' + taskid);
          return get(taskCountRef).then((snapshot) => ({
            id: snapshot.key,
            title: snapshot.val()["title"]
          }));
        });
  
        const tasks = await Promise.all(tasksPromises);
        setTaskList(tasks);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getTask().then(() => {
      setLoad(false)
    })
  }, [])

  if (load) {
    return (
      <ActivityIndicator />
    )
  } else {
    const SwipeCard = ({ CardValue, cardList }) => { // Receive cardList as a prop
      // console.log("123" + cardList)
      const handleRight = async (index) => {
        const phone = await retrieveUserInfo("phone");
        update(ref(database, 'users/' + phone), {
            'todayTask': cardList[index].id,
          }).then(()=>{
              CardValue(cardList[index].id) // Use cardList to retrieve the task ID
          }).catch((error)=>{
              console.log(error)
          });
      }

      return (
        <View style={styles.container}>
          <Swipe
            cards={cardList} // Use cardList as the cards prop
            renderCard={(card) => (
              <View style={styles.container}>
                <Card containerStyle={{ width: '70%' }}>
                  <Card.Title h4 style={{ margin: 10, textAlign:'left' }}>{card.title}</Card.Title>
                  <Card.Divider />
                  <Text style={{ textAlign: 'center' }}>Swipe left to find more</Text>
                  <Text style={{ textAlign: 'center' }}>Swipe right to accept the task!</Text>
                </Card>
              </View>
            )}
            cardVerticalMargin={0}
            cardHorizontalMargin={0}
            verticalSwipe={false}
            backgroundColor=""
            containerStyle={styles.container}
            infinite={true}
            onSwipedRight={(cardIndex) => { handleRight(cardIndex) }}
            // TODO 处理卡片全部刷完的逻辑
            onSwipedAll={() => { Alert.alert("All tasks have been presented.", "") }}
            swipeBackCard={false}
          ></Swipe>
        </View>
      )
    }

    return (
      <View>
        <SwipeCard CardValue={getValue} cardList={taskList} /> 
      </View>
    )
  }
}