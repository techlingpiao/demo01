import { Input,Text, Button, Card, Image, Icon, Dialog } from "@rneui/themed";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import IonIcons from 'react-native-vector-icons/Ionicons'
import { Alert } from "react-native";
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

const Submit = ({setVisible}) => {
    const [image, setImage] = useState(null);

    const styles = StyleSheet.create({
        container: {
            position: 'relative',
        },
        deleteIcon: {
            position: 'absolute',
            top: 0,
            right: 0,
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
                    text: 'Cancel',
                    style:'cancel'
                },{
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

    const takePhoto = () => {
        const options = {
            title: 'Select Image',
            storageOptions: {
                skipBackup: true,
                path: 'images',
                mediaType: "photo"
            },
        };

        launchCamera(options, (response) => {
            if (response.didCancel) {
                Alert.alert('You have cancelled taken an image',"");
            } else if (response.errorCode == "permission") {
                Alert.alert('Sorry, we need camera permissions to make this work!',"");
            } else {
                setImage(response.assets[0].uri);
            }
        });
    }

    const pickImage = () => {
        const options = {
            title: 'Select Image',
            storageOptions: {
                skipBackup: true,
                path: 'images',
                mediaType: "photo"
            },
        };
        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                Alert.alert('You have cancelled chosen an image',"");
            } else if (response.errorCode == "permission") {
                Alert.alert('Sorry, we need photo library permissions to make this work!',"");
            } else {
                // console.log(response.assets)
                setImage(response.assets[0].uri);
            }
        });
    }

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

    const handleSubmit = () => {

    }

    const handleCancel = ()=>{
        setVisible(false)
    }

    return(
        <Dialog>
            <Dialog.Title title="Record" titleStyle={{fontSize:20}}></Dialog.Title>
            {/* <Card.Divider/> */}
            <ScrollView>
                <Text style={{fontWeight:'bold', fontSize:16}}>comments</Text>
                <Input multiline placeholder="anything you want to record"
                    inputStyle={{fontSize: 15}}
                />
                {image && (
                    <View style={styles.container}>
                        <Image source={{uri: image}} style={{width:"100%", height:300, resizeMode: 'contain'}}/>
                        <IonIcons
                            name="close-outline"
                            size={10}
                            color="white"
                            style={styles.deleteIcon}
                            onPress={handleDelete}
                        />
                    </View>
                )}
                    <Dialog.Actions>
                    <Dialog.Button onPress={handleSubmit}>Submit</Dialog.Button>
                    <Dialog.Button onPress={handleChooseImage}>
                        <IonIcons name="cloud-upload-outline" style={{marginRight:2}}></IonIcons>
                        Upload Image
                    </Dialog.Button>
                    <Dialog.Button onPress={handleCancel}>Cancel</Dialog.Button>
                </Dialog.Actions>
            </ScrollView>
        </Dialog>
            
    )
}

export default Submit