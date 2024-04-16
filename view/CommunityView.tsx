//TODO community界面
import * as React from "react";
import { View,Text } from "react-native";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import OtherToday from "./OtherToday";
import MyToday from "./MyToday";

const Tab = createMaterialTopTabNavigator();

export default function CommunityView(){
    return (
        <Tab.Navigator>
            <Tab.Screen name="Other's Detour" component={OtherToday}></Tab.Screen>
            <Tab.Screen name="My Detour History" component={MyToday}></Tab.Screen>
        </Tab.Navigator>
    )
}