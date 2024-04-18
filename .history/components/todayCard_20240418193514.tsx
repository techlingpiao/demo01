import { ListItem } from "@rneui/base";
import { Avatar, Card, Text } from "@rneui/themed";
import React from "react";
import { StyleSheet } from "react-native";

const TodayCard = ({isOther, time, username, taskname, description, image}) => {

    const styles = StyleSheet.create({
        cardTitleStyle:{
            padding: 0,
            margin:0,
            left: 0,
            maxHeight: 200
        }
    })
    
    const OtherCardTitle = () => {
        return(
            <ListItem style={styles.cardTitleStyle}>
                <Avatar rounded icon={{
                    name: "person-outline",
                    type: "material",
                    size: 30,
                }}
                containerStyle={{ backgroundColor: "#c2c2c2"}}
                avatarStyle={{margin:0,padding:0}}
                />
                <ListItem.Content>
                    <ListItem.Title style={{fontSize: 18}}>{username}</ListItem.Title>
                    <ListItem.Subtitle>{time}</ListItem.Subtitle>
                </ListItem.Content>
            </ListItem>
        )
    }

    const MyCardTitle = () => {
        return(
            <ListItem style={styles.cardTitleStyle}>
                <ListItem.Content>
                    <ListItem.Title style={{fontSize: 18}}>{taskname}</ListItem.Title>
                    <ListItem.Subtitle>{time}</ListItem.Subtitle>
                </ListItem.Content>
            </ListItem>
        )
    }
    
    return (
        <Card containerStyle={{marginBottom:0}}>
            <Card.Title style={{padding:0,marginBottom:0}}>
                {isOther ? <OtherCardTitle /> : <MyCardTitle />}
            </Card.Title>
            <Card.Divider/>
            {image != "" ? (<Card.Image style={{padding:0,  width: "100%" }} source={{uri: image}} 
                                resizeMode="contain" 
                                PlaceholderContent="loading"></Card.Image>) : (<></>)}
            <Text style={{fontSize: 16}}>{description}</Text>
        </Card>
    )
}

export default TodayCard

