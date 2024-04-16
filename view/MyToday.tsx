import * as React from "react";
import TodayCard from "../components/todayCard";
import { ScrollView } from "react-native";

const MyToday = () => {

    return (
        <ScrollView>
            <TodayCard isOther={false} time="01" taskname="bao" description="123" username=""
                image="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.nga.178.com%2Fattachments%2Fmon_202108%2F28%2F-7Q176-ir7xK1gT1kShs-hs.jpg&refer=http%3A%2F%2Fimg.nga.178.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1715765831&t=07d4375b0261b7a25d1bc31393bedd35"/>
        </ScrollView>
    )
} 

export default MyToday