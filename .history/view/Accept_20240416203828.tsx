import React, {useEffect, useState} from "react";
import { View,StyleSheet} from "react-native";
import { Card,Button } from '@rneui/themed';
import { get, getDatabase, ref } from "firebase/database";
import app from "../db/dbConfig";
import { retrieveUserInfo } from '../db/session';
import { update } from 'firebase/database';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Submit from "./Submit";

const Stack = createNativeStackNavigator();

const styles = StyleSheet.create({
    container: {
        //垂直居中
        flex:1,
        alignItems:'center',
        justifyContent: 'center',
        marginTop:200
    },
})

const Accept = (props,{navigation}) => {
    const [buttonTitle, setButtonTitle] = useState('Done!');
    const [isDisabled, setIsDisabled] = useState(false);
    const [title, setTitle] = useState("");

    const changeState = async () => {
        const phoneNumber = await retrieveUserInfo('phone');
        if (!phoneNumber) {
            console.error('User phone number not found');
            return;
        }

        // 获取数据库引用
        const db = getDatabase(app);
        const userRef = ref(db, `users/${phoneNumber}`);

        try {
            // 获取当前的 totalTask 值
            const snapshot = await get(userRef);
            if (snapshot.exists()) {
                const userData = snapshot.val();
                const currentTotalTasks = userData.totalTask || 0;

             // 更新 totalTask 值
            await update(userRef, {
                totalTask: currentTotalTasks + 1
            });

            // 更新状态和界面
            setButtonTitle('Finish!');
            setIsDisabled(true);
        }
    } catch (error) {
        console.error('Failed to update totalTask:', error);
    }
};

    const callSubmit = () => {
        navigation.navigate("record")
    }


    useEffect(() => {
        const fetchData = async () => {
            //从firebase获取标题
            const db = getDatabase(app);
            const taskCountRef = ref(db, 'tasks/' + props.taskid);
            const taskSnapshot = await get(taskCountRef);
            setTitle(taskSnapshot.val().title); // 修改标题
        };
        fetchData();
    }, [props.taskid]);

    const Initial = () => {
        return (
            <View style={{alignItems:'center',justifyContent:'center',width:'100%',height:'100%'}}>
                <Card containerStyle={{width: '70%'}}>
                    <Card.Title h4 style={{margin:10, textAlign:'left'}}>{title}</Card.Title>
                    <Card.Divider/>
                    <Button type="clear" title={buttonTitle} disabled={isDisabled} onPress={changeState}></Button>
                    {isDisabled ? (<Button type="clear" title="Would you like to record something?" onPress={callSubmit}></Button>) : (<></>)}
                </Card>
            </View>
        )
    }

   
    return(
            <Stack.Navigator initialRouteName="task2">
                <Stack.Screen name="task2" component={Initial}></Stack.Screen>
                <Stack.Screen name="record" component={Submit}></Stack.Screen>
            </Stack.Navigator>
    )
}

export default Accept