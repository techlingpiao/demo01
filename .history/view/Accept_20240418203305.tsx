import React, {useEffect, useState} from "react";
import { View,StyleSheet} from "react-native";
import { Card,Button,Text } from '@rneui/themed';
import { equalTo, get, getDatabase, orderByChild, query, ref } from "firebase/database";
import app from "../db/dbConfig";
import { retrieveUserInfo } from '../db/session';
import { update } from 'firebase/database';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Submit from "./Submit";
import { getDownloadURL, getStorage, ref as refStorage } from "firebase/storage";

const Stack = createNativeStackNavigator();
const storage = getStorage(app)
const db = getDatabase(app);

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
    const [recordButtonTitle, setRecordButtonTitle] = useState('Would you like to record something?')
    const [isDisabled, setIsDisabled] = useState(false);
    const [title, setTitle] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [change,setChange] = useState(0)
    const [record, setRecord] = useState({
        "comment": "",
        "image": "",
        "id": "",
        "imageUrl": ""
    });

    const changeState = async () => {
        const phoneNumber = await retrieveUserInfo('phone');
        if (!phoneNumber) {
            console.error('User phone number not found');
            return;
        }

        // 获取数据库引用
        const db = getDatabase(app);
        const userRef = ref(db, `users/${phoneNumber}`);
        const taskid = props.taskid
        const assignRef = ref(db, `assignedTask/${phoneNumber}`)

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

            await update(assignRef, {
                [taskid]: true
            })

            // 更新状态和界面
            setButtonTitle('Finish!');
            setIsDisabled(true);
        }
    } catch (error) {
        console.error('Failed to update totalTask:', error);
    }
};

    const callSubmit = () => {
        setIsVisible(true)
    }

    const initiateRecord = async (child) =>{
        setRecordButtonTitle('Change Record')
        if(child.val().image == undefined){
            setRecord({
                comment: child.val().comment,
                id: child.key
            });
        }else{
            const storageRef = refStorage(storage,"images/"+child.val().image)
            const imageUrl = await getDownloadURL(storageRef)
            setRecord({
                comment: child.val().comment,
                image: imageUrl,
                imageUrl: child.val().image,
                id: child.key
            });
        }
        
    }


    useEffect(() => {
        const fetchData = async () => {
            //从firebase获取标题
            const taskCountRef = ref(db, 'tasks/' + props.taskid);
            const taskSnapshot = await get(taskCountRef);
            setTitle(taskSnapshot.val().title); // 修改标题
            const phoneNumber = await retrieveUserInfo('phone')
            const taskid = props.taskid
            const assignRef = ref(db, `assignedTask/${phoneNumber}/${taskid}`)
            const assignSnapshot = await get(assignRef)
            if(assignSnapshot.val()){
                setButtonTitle('Finish!');
                setIsDisabled(true);
            }
            //检查是否已经record
            const recordRef = ref(db, `record`)
            const recordSnapshot = await get(query(recordRef, orderByChild('user'), equalTo(phoneNumber)))
            let c
            recordSnapshot.forEach((child)=>{
                if(child.val().task == taskid){
                    c = child
                }
            })
            if (c != undefined){
                await initiateRecord(c)
            }
        };
        fetchData();
    }, [props.taskid]);

    const setVisible2 = (visi) =>{
        setIsVisible(visi)
        navigation.navigate("task")
    }

    return(
        <View style={{alignItems:'center',justifyContent:'center',width:'100%',height:'100%'}}>
            <Card containerStyle={{width: '70%'}}>
                <Card.Title h4 style={{margin:10, textAlign:'left'}}>{title}</Card.Title>
                <Card.Divider/>
                <Button type="clear" title={buttonTitle} disabled={isDisabled} onPress={changeState}></Button>
                {isDisabled ? (<Button type="clear" title={recordButtonTitle} onPress={callSubmit}></Button>) : (<></>)}
                {isVisible ? (<Submit setVisible={setVisible2} taskid={props.taskid} initRecord={record}/>) : (<></>)}
            </Card>
            <Text style={{display:'none'}}>change</Text>
        </View>
    )
}

export default Accept