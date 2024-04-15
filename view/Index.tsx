//登录功能的导航页，进入app第一个渲染的导航
import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import App from "./App";
import Login from './Login'
import Register from "./Register";
import ForgetPassword from "./ForgetPassword";
import ChangePassword from "./ChangePassword";

//初始化StackNavigator
const Stack = createNativeStackNavigator();
const Index = () =>{
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="login" component={Login} options={{headerShown: false}}/>
                <Stack.Screen name="register" component={Register} options={{headerShown: false}}/>
                <Stack.Screen name="forget" component={ForgetPassword} options={{headerShown: false}}/>
                <Stack.Screen name="app" component={App} options={{headerShown: false}}/>
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Index
