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

const MyToday = () => {
    const [load,setLoad] = useState(false);
    const [data, setData] = useState([]);
    const [noData, setNoData] = useState(false);

    const getNewData = async (phone) => {
        setLoad(true)
        const dataRef = ref(database, "record")
        let dataQuery = query(dataRef, orderByChild('user'), equalTo(phone))
        let dataSnapshot = await get(dataQuery)
        if (dataSnapshot.size === 0) {
            setNoData(true)
        } else {
            const promises = [];
            dataSnapshot.forEach((child) => {
                promises.push(
                    (async () => {
                        const taskTitleSnapshot = await get(ref(database, `tasks/${child.val().task}/title`));
                        console.log(taskTitleSnapshot.val())
                        let newData = {
                            "id": child.key,
                            "task": taskTitleSnapshot.val(),
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
                    })()
                );
            });
            await Promise.all(promises);
        }
        setLoad(false);
    }

    useEffect(()=>{
        const fetchData = async () => {
            const phone = await retrieveUserInfo("phone")
            await getNewData(phone)
        }
        fetchData()
    },[])

    return (
        <>
        {!noData ? (<ScrollView>
                {data.map((item, index) => (
                    <TodayCard key={item["id"]} isOther={false} time={item["date"]} username="" taskname={item["task"]} description={item["comment"]} image={item["image"]}/>
                ))}
        </ScrollView>) : (<Text style={{ alignSelf:'center', color: '#808080', fontSize:20}}>Sorry, there is no data</Text>)}
        <Dialog isVisible={load}>
                <Dialog.Title title="Please wait..." titleStyle={{ textAlign: 'center', fontSize: 18 }}></Dialog.Title>
                <Dialog.Loading />
        </Dialog>
        </>
    )
} 

export default MyToday