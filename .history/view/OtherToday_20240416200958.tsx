import * as React from "react";
import { ScrollView } from "react-native";
import TodayCard from "../components/todayCard";

const OtherToday = () => {

    return (
        <ScrollView>
            <TodayCard isOther={true} time="01" username="bao" taskname="" description="123" 
                image="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.nga.178.com%2Fattachments%2Fmon_202108%2F28%2F-7Q176-ir7xK1gT1kShs-hs.jpg&refer=http%3A%2F%2Fimg.nga.178.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1715765831&t=07d4375b0261b7a25d1bc31393bedd35"></TodayCard>
         <TodayCard isOther={true} time="01" username="bao" taskname="" description="123" 
                image="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.nga.178.com%2Fattachments%2Fmon_202108%2F28%2F-7Q176-ir7xK1gT1kShs-hs.jpg&refer=http%3A%2F%2Fimg.nga.178.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1715765831&t=07d4375b0261b7a25d1bc31393bedd35"></TodayCard>
        <TodayCard isOther={true} time="01" username="bao" taskname="" description="123" 
                image="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.nga.178.com%2Fattachments%2Fmon_202108%2F28%2F-7Q176-ir7xK1gT1kShs-hs.jpg&refer=http%3A%2F%2Fimg.nga.178.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1715765831&t=07d4375b0261b7a25d1bc31393bedd35"></TodayCard>
 
        </ScrollView>
    )
} 

export default OtherToday