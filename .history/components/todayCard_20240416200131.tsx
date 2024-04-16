import { ListItem } from "@rneui/base";
import { Avatar, Card, Text } from "@rneui/themed";
import React from "react";

const TodayCard = ({isOther, time, username, taskname, description, image}) => {
    
    const OtherCardTitle = () => {
        return(
            <ListItem style={{margin:0}}>
                <Avatar rounded icon={{
                    name: "person-outline",
                    type: "material",
                    size: 35,
                }}
                containerStyle={{ backgroundColor: "#c2c2c2" }}/>
                <ListItem.Content>
                    <ListItem.Title>{username}</ListItem.Title>
                    <ListItem.Subtitle>{time}</ListItem.Subtitle>
                </ListItem.Content>
            </ListItem>
        )
    }

    const MyCardTitle = () => {
        return(
            <ListItem style={{margin:0,padding:0}}>
                <ListItem.Content>
                    <ListItem.Title>{taskname}</ListItem.Title>
                    <ListItem.Subtitle>{time}</ListItem.Subtitle>
                </ListItem.Content>
            </ListItem>
        )
    }
    
    return (
        <Card>
            <Card.Title style={{padding:0,margin:0, alignContent:'flex-start'}}>
                {isOther ? <OtherCardTitle /> : <MyCardTitle />}
            </Card.Title>
            <Card.Divider/>
            {image != "" ? (<Card.Image style={{padding:0,  width: "100%" }} source={{uri: image}} 
                                resizeMode="contain" 
                                PlaceholderContent="loading"></Card.Image>) : (<></>)}
            <Text>{description}</Text>
        </Card>
    )
}

export default TodayCard

