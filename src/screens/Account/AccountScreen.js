import React, { useEffect } from "react";
import { Button, SafeAreaView, StyleSheet, TextInput } from "react-native";

import PLANTDATA from "../../constant/PLANTDATA";

import { app, db } from "../../firebase";
import { collection, doc, addDoc} from "firebase/firestore";

function AccountScreen() {
  const saveData = async (data,count) => {


    try {
      const docRef = await addDoc(collection(db, "tbl_plant_data"), {
        id:count,
        title: data.title,
        description: data.description,
        price: data.price,
        currency: data.currency,
        category: data.category,
        img: data.img,
        size: data.size,
        plantType: data.plantType,
        height: data.height,
        humidity: data.humidity,
        waterEvery: data.waterEvery,
        unit: data.unit,
        rating: data.rating,
      });

      console.log("Document written withID : ", docRef.id);
    } catch (e) {
      console.log("Error adding document: ", e);
    }
  };

  const startAdding = () => {
    let count = 0;
    PLANTDATA.map((item) => saveData(item,count++))      
  };

  return (
    <SafeAreaView style={{ marginTop: 40 }}>
      <Button
        title="Start"
        onPress={() => {
          startAdding();
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default AccountScreen;
