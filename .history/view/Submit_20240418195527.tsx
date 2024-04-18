import { Input,Text, Button, Card, Image, Icon, Dialog } from "@rneui/themed";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import IonIcons from 'react-native-vector-icons/Ionicons'
import { Alert } from "react-native";
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { deleteObject, getStorage, ref as refStorage, uploadBytes} from "firebase/storage";
import app from "../db/dbConfig";
import { retrieveUserInfo } from "../db/session";
import { getDatabase, ref as refDatebase, push, ref, update } from "firebase/database";

const storage = getStorage(app)
const database = getDatabase(app)

const Submit = ({setVisible,taskid,initRecord}) => {
    const [image, setImage] = useState(null);
    const [comment,setComment] = useState("")
    const [load,setLoad] = useState(false)

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

    useEffect(()=>{
        if(initRecord["id"] != ""){
            console.log(initRecord["id"])
            setComment(initRecord["comment"])
            setImage(initRecord["image"])
        }
    },[])

    const getDate = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        return formattedDate
    }

    const handleChooseImage = () => {
        if(image) {
            Alert.alert("You have chosen an image, please delete it first or just press submit.","")
            return
        }
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

    const handleSubmit = async () => {
        setLoad(true)
        const phone = await retrieveUserInfo("phone")
        const recordRef = refDatebase(database, "record")
        try{
            Alert.alert(phone)
            const filename = phone + Date.now() +".jpg"
            const record = {
                "user": phone,
                "task": taskid,
                "comment": comment,
                "date": getDate()
            }
            if(image){
                const imageRef = refStorage(storage,"images/"+filename)
                const file = await fetch(image).then((res) => res.blob());
                const metadata = {
                    contentType: 'image/jpeg',
                };
                await uploadBytes(imageRef, file, metadata)
                record["image"] = filename
            }
            //如果是在更改，则删除原照片，update数据库
            if(initRecord["id"] == ""){
                await push(recordRef, record)
            }else{
                const removeImageRef = refStorage(storage,"images/"+initRecord["imageUrl"])
                await deleteObject(removeImageRef)
                const recordRef = ref(database, "record/" + initRecord["id"])
                update(recordRef,record)
            }
            Alert.alert("You have recorded successfully!","")
            setVisible(false)
            setLoad(false)
        }catch(err){
            setLoad(false)
            Alert.alert("SubmitError, please check console")
            console.log("SubmitError:"+err)
        }
    }

    const handleCancel = ()=>{
        setVisible(false)
    }

    const handleInputChange = (value) => {
        setComment(value)
    }

    return(
        <><Dialog>
            <Dialog.Title title="Record" titleStyle={{ fontSize: 20 }}></Dialog.Title>
            <ScrollView>
                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>comments</Text>
                <Input multiline placeholder="anything you want to record"
                    inputStyle={{ fontSize: 15 }}
                    onChangeText={handleInputChange} 
                    value={comment}/>
                {image && (
                    <View style={styles.container}>
                        <Image source={{ uri: image }} style={{ width: "100%", height: 300, resizeMode: 'contain' }} />
                        <IonIcons
                            name="close-outline"
                            size={10}
                            color="white"
                            style={styles.deleteIcon}
                            onPress={handleDelete} />
                    </View>
                )}
                <Dialog.Actions>
                    <Dialog.Button onPress={handleSubmit}>Submit</Dialog.Button>
                    <Dialog.Button onPress={handleChooseImage}>
                        <IonIcons name="cloud-upload-outline" style={{ marginRight: 2 }}></IonIcons>
                        Upload Image
                    </Dialog.Button>
                    <Dialog.Button onPress={handleCancel}>Cancel</Dialog.Button>
                </Dialog.Actions>
            </ScrollView>
        </Dialog>
        <Dialog isVisible={load}>
            <Dialog.Title title="Please wait..." titleStyle={{ textAlign: 'center', fontSize: 18 }}></Dialog.Title>
            <Dialog.Loading />
        </Dialog>
        </>
    )
}

export default Submit