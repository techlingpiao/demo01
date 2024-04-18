import React, {useEffect, useState} from "react";
import { ScrollView } from "react-native";
import TodayCard from "../components/todayCard";
import { Dialog,Text } from "@rneui/themed";
import { equalTo, get, getDatabase, orderByChild, query, ref} from "firebase/database";
import app from "../db/dbConfig";
import { getDownloadURL, getStorage, ref as refStorage } from "firebase/storage";
import { retrieveUserInfo } from "../db/session";

const database = getDatabase(app)
const storage = getStorage(app)


const OtherToday = () => {
    const [load,setLoad] = useState(false);
    // const [page, setPage] = useState(1);
    const [data, setData] = useState([]);
    // const [taskid, setTaskId] = useState("");
    // const [noMoreData, setNoMoreData] = useState(false);
    const [noData, setNoData] = useState(false);

    // const handleScrollEndDrag = (e) => {
    //     // console.log(e)
    //     const offsetY = e.nativeEvent.contentOffset.y; //滑动距离
    //     const contentSizeHeight = e.nativeEvent.contentSize.height; //scrollView contentSize高度
    //     const scrollHeight = e.nativeEvent.layoutMeasurement.height; //scrollView高度
    //     //似乎有时会有误差，比如滑到底部但是(755.9999771118164<756)，我的解决思路是取ceil
    //     if (Math.ceil(offsetY + scrollHeight) >= contentSizeHeight) {
    //         if (!noMoreData) {
    //             setPage(page + 1)
    //             getNewData(taskid,page)
    //         }else{
    //             Alert.alert("No more data","");
    //         }
    //     }
    // }

    const getNewData = async (taskidd) => {
        // console.log("page"+page)
        setLoad(true)
        const dataRef = ref(database, "record")
        const phone = await retrieveUserInfo("phone")
        // const limit = page * 3
        // console.log("limit"+limit)
        let dataQuery = query(dataRef, orderByChild('task'), equalTo(taskidd))
        let dataSnapshot = await get(dataQuery)
        // console.log("datasnapshot"+dataSnapshot.val()
        let flag = false
        if (dataSnapshot.size < 0) {
            setNoData(true)
            flag = true
        } 
        if(dataSnapshot.size == 1){
            dataSnapshot.forEach((child)=>{
                if(child.val().user == phone){
                    setNoData(true)
                    flag = true
                }
            })
        }
        if(!flag){
            const promises = [];
            dataSnapshot.forEach((child) => {
                promises.push(
                    (async () => {
                        if(child.val().user != phone){
                            const userNameSnapshot = await get(ref(database, `users/${child.val().user}/name`));
                            let newData = {
                                "id": child.key,
                                "user": userNameSnapshot.val(),
                                "date": child.val().date,
                                "comment": child.val().comment,
                            };
                            if (child.val().image !== undefined) {
                                const storageRef = refStorage(storage, "images/" + child.val().image);
                                const imageUrl = await getDownloadURL(storageRef);
                                newData.image = imageUrl;
                            } else {
                                newData.image = "";
                            }
                            setData((prevData) => [...prevData, newData]);
                        }
                    })()
                    );
            });
            await Promise.all(promises);
        }
        
            // if (dataSnapshot.size < page * 3) {
            //     setNoMoreData(true);
            //     Alert.alert("No more data","");
            // }
        
        setLoad(false);
    }

    useEffect(()=>{
        const fetchData = async () => {
            const phone = await retrieveUserInfo("phone")
            const taskidRef = ref(database, `users/${phone}`)
            const taskidd = await get(taskidRef)
            const task = taskidd.val().todayTask
            await getNewData(task)
            // setTaskId(taskid)
        }
        fetchData()
    },[])

    return (
        <>
        {!noData ? (<ScrollView>
                {data.map((item, index) => (
                    <TodayCard key={item["id"]} isOther={true} time={item["date"]} username={item["user"]} taskname="" description={item["comment"]} image={item["image"]}/>
                ))}
        </ScrollView>) : (<Text style={{ alignSelf:'center', color: '#808080', fontSize:20}}>Sorry, there is no data</Text>)}
        <Dialog isVisible={load}>
                <Dialog.Title title="Please wait..." titleStyle={{ textAlign: 'center', fontSize: 18 }}></Dialog.Title>
                <Dialog.Loading />
        </Dialog>
        </>
    )
} 

export default OtherToday