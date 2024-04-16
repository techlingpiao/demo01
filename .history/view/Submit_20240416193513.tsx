import { Input,Text, Button, Card, Image, Icon} from "@rneui/themed";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import IonIcons from 'react-native-vector-icons/Ionicons'
import { Alert } from "react-native";

const Submit = () => {
    const [image, setImage] = useState(null);

    const styles = StyleSheet.create({
        container: {
            position: 'relative',
        },
        deleteIcon: {
            position: 'absolute',
            top: 10,
            right: 10,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            borderRadius: 50,
            padding: 5,
        },
    });

    const handleChooseImage = () => {
        Alert.alert(
            'Choose',
            'Open Camera or Photo Library?',
            [
                {
                    text: 'Camera',
                    onPress: () => {
                        takePhoto()
                    }
                },{
                    text: 'Photo Library',
                    onPress: () => {
                        pickImage()
                    },
                },
            ],
        )
    }

    // const takePhoto = () => {
    //     const options = {
    //         title: 'Select Image',
    //         storageOptions: {
    //             skipBackup: true,
    //             path: 'images',
    //             mediaType: "photo"
    //         },
    //     };

    //     ImagePicker.launchCamera(options, (response) => {
    //         if (response.didCancel) {
    //             Alert.alert('You have cancelled taken an image',"");
    //         } else if (response.errorCode == "permission") {
    //             Alert.alert('Sorry, we need camera permissions to make this work!',"");
    //         } else {
    //             setImage(response.assets.uri);
    //         }
    //     });
    // }

    // const pickImage = () => {
    //     const options = {
    //         title: 'Select Image',
    //         storageOptions: {
    //             skipBackup: true,
    //             path: 'images',
    //             mediaType: "photo"
    //         },
    //     };

    //     ImagePicker.launchImageLibrary(options, (response) => {
    //         if (response.didCancel) {
    //             Alert.alert('You have cancelled chosen an image',"");
    //         } else if (response.errorCode == "permission") {
    //             Alert.alert('Sorry, we need photo library permissions to make this work!',"");
    //         } else {
    //             setImage(response.assets.uri);
    //         }
    //     });
    // }

    const handleDelete = () => {
        Alert.alert(
            'Delete',
            'Are your sure you want to delete this image?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },{
                    text: 'OK',
                    onPress: () => {
                        setImage(null);
                    },
                },
            ],
        )
    };

    return(
        <Card containerStyle={{width: '70%'}}>
            <Card.Title h4 style={{margin:10, textAlign:'left'}}>Record</Card.Title>
            <Card.Divider/>
            <Text>comments</Text>
            <Input multiline placeholder="Please write down what you want to record"/>
            <Button onPress={handleChooseImage}>
                <IonIcons name="cloud-upload-outline"></IonIcons>
                Upload Image
            </Button>
            {image && (
                <View style={styles.container}>
                    <Card.Image resizeMode="contain"  source={image}  PlaceholderContent="loading"/>
                    <IonIcons
                        name="close-outline"
                        size={24}
                        color="white"
                        style={styles.deleteIcon}
                        onPress={handleDelete}
                    />
                </View>
            )}
        </Card>
    )
}

export default Submit