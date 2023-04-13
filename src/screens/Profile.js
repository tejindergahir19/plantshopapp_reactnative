import React from "react";
import { Button } from "react-native";
import { Text } from "react-native";

function Profile({navigation}){
    return (
        <>
        <Text>Profile</Text>
        <Button title="Go" onPress={()=>{
             navigation.navigate('Profile', {name: 'Jane'})
        }}/>
        </>
    )
}

export default Profile;