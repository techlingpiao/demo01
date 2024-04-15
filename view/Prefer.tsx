//选取preferTask的界面
import React, { useEffect, useState } from "react";
import { View} from "react-native";
import { retrieveUserInfo } from "../db/session";
import { equalTo, get, getDatabase, orderByChild, query, ref, update } from "firebase/database";
import app from "../db/dbConfig";
import { Button, ListItem } from "@rneui/themed";
import { Alert } from "react-native";

const Prefer = ({navigation})=>{
    const [taskType, setTaskType] = useState([]);
    const [preferTaskList, setPreferTaskList] = useState([]);
    const [checkList,setCheckList] = useState({});
    const database = getDatabase(app)
    const getPrefer = async ()=>{
        try{
            //获取本地数据库的phone属性
            const phone = await retrieveUserInfo("phone")
            //获得firebase用户prefer的Task
            const preferRef = ref(database, 'users/'+ phone + "/preferTask")
            const snapshot = await get(preferRef)
            //字符串转数组
            setPreferTaskList(snapshot.val().split(","))
            //获得firebase所有的Task Type
            const taskTypeSnapshot = await get(ref(database, 'taskType'))
            setTaskType(taskTypeSnapshot.val().split(","))
        } catch(err){
            console.error(err);
        }
    }

    const setupCheckList = () => {
        //初始化CheckBox的状态，preferTask存在则为true（打钩状态）
        const updatedCheckList = {};
        taskType.forEach((type) => {
        updatedCheckList[type] = preferTaskList.includes(type);
        });
        setCheckList(updatedCheckList);
    };

    //useEffect是在渲染组件之前优先执行的函数（用于提前获取数据再渲染界面）
    useEffect(() => {
        getPrefer()
    }, []);

    useEffect(() => {
        setupCheckList()
    }, [preferTaskList, taskType]);

    const arraysEqual = (arr1, arr2) => {
        //判断两个数组是否相等
        const sortedArr1 = [...arr1].sort();
        const sortedArr2 = [...arr2].sort();
        return JSON.stringify(sortedArr1) === JSON.stringify(sortedArr2);
    }

    const getChangeType = (list, newList) => {
        //获取增加的和删除的task type
        const add = newList.filter(item=>!list.includes(item))
        const remove = list.filter(item=>!newList.includes(item))
        return [add, remove]
    }

    const handleSubmit = async () => {
        try{
            const newPreferList = []
            Object.keys(checkList).forEach((key)=>{
                if (checkList[key]){
                    newPreferList.push(key)
                }
            })
            if(!arraysEqual(preferTaskList,newPreferList)){
                const list = newPreferList.join(",")
                const phone = await retrieveUserInfo("phone");
                await update(ref(database, "users/"+phone), {preferTask: list})
                const [add, remove] = getChangeType(preferTaskList, newPreferList)
                if(add.length > 0 ){
                    //将增加的type中的所有数组加入assignedTask中
                    let updateList = {}
                    const taskRef = ref(database, 'tasks')
                    for (const item of add) {
                        const taskSnapshot = await get(query(taskRef, orderByChild('type'), equalTo(item)))
                        let potentialAddTask = []
                        taskSnapshot.forEach((child)=>{
                            potentialAddTask.push(child.key)
                        })
                        for (const id of potentialAddTask){
                            const snapshot = await get(ref(database, 'assignedTask/'+ phone + "/" + id))
                            //已存在的task不加入
                            if (!snapshot.exists()){
                                updateList[id] = false
                            }
                        }
                    }
                    await update(ref(database, 'assignedTask/'+ phone), updateList)
                }
                if(remove.length > 0 ){
                    //将删除的type对应的task从assignedTask中删除
                    let updateList = {}
                    const taskRef = ref(database, 'tasks')
                    for (const item of remove){
                        const taskSnapshot = await get(query(taskRef, orderByChild('type'), equalTo(item)))
                        let potentialRemoveTask = []
                        taskSnapshot.forEach((child)=>{
                            potentialRemoveTask.push(child.key)
                        })
                        for (const id of potentialRemoveTask){
                            const snapshot = await get(ref(database, 'assignedTask/'+ phone + "/" + id))
                            //已完成的任务不删除
                            if (snapshot.val() != true){
                                updateList[id] = null
                            }
                        }
                    }
                    await update(ref(database, 'assignedTask/'+ phone), updateList)
                }
                Alert.alert("Your preferences have been recorded!","")
                navigation.navigate("settings2")
            }else{
                Alert.alert("You didn't make any changes","")
                navigation.navigate("settings2")
            }
        }catch(err){
            console.error(err)
        }
    }

    return(
        <View>
            {
                // 相当于for循环整个数组，根据数组长度动态渲染组件
                Object.keys(checkList).map(( key ) => (
                    <ListItem bottomDivider>
                        <ListItem.CheckBox
                            checked={checkList[key]}
                            onPress={() =>
                                setCheckList((prevState) => ({
                                    ...prevState,
                                    [key]: !prevState[key],
                                }))
                            }
                        />
                        <ListItem.Content>
                        <ListItem.Title>{key}</ListItem.Title>
                        </ListItem.Content>
                    </ListItem>
                ))
            }
            <Button buttonStyle={{marginTop:10}} title="SUBMIT" onPress={handleSubmit}></Button>
        </View>
    )
}

export default Prefer
