import React, { useState,useRef,useEffect} from "react";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Platform,

  BackHandler
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";

import COLORS from "../../constant/COLORS";
import BottomNavigation from "../../components/BottomNavigation";

import { db } from "../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth();

function AlarmScreen({navigation,route}) {

  const refreshAll = route?.params?.refreshAll;

  const userId = useRef(null);

  const isUserLogin = async () => {
    await onAuthStateChanged(auth, (user) => {
      if (user) {
        userId.current = user.uid;
        fetchProductsFromOrders();
      } else {
        navigation.navigate("Login", { name: "Login" });
      }
    });
  };

  const fetchProductsFromOrders = async () => {

    let tmpData = [];
    let tmpPlants = [];
    
    try {
      const q = query(
        collection(db, "tbl_orders"),
        where("userId", "==", userId.current)
      );
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        console.log(doc.createTime);
        tmpData.push(doc?.data()?.items?.map((item,key)=>(item.productId)));
      });

      tmpData.flat().map((item,key)=>(
        tmpPlants.push(item)
      ))
      



      console.log(tmpPlants)
    } catch (error) {
      console.error("Error fetching wishlist: ", error);
    }

  }

  useEffect(() => {
    isUserLogin();

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      ()=>{
        refreshAll();
      }
    );

    return () => backHandler.remove();
  }, []);

  return (
    <SafeAreaView style={[{ flex: 1 }, styles.defaults]}>
      <View style={[styles.header, styles.iosPadding]}>
        <TouchableOpacity
          onPress={() => {
            refreshAll();
            navigation.goBack();
          }}
        >
          <Icon name="arrow-back" size={32} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Water Alert</Text>
        <View>
          <TouchableOpacity>
            <Icon
              name="log-out-outline"
              color={COLORS.white}
              size={24}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[{ flex: 1, paddingVertical: 20 }, styles.iosPadding]}>
        
      </View>

      <View style={styles.iosPadding}>
        <BottomNavigation navigation={navigation} refreshAll={refreshAll}  screen="alarm" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  defaults: {
    backgroundColor: COLORS.primaryBackgroundColor,
    padding: 20,
  },
  iosPadding: {
    paddingHorizontal: Platform.OS === "ios" ? 20 : 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    color: COLORS.primary,
    fontWeight: "bold",
    fontSize: 20,
  },
  accountTabs:{
    backgroundColor:COLORS.grey,
    borderRadius:6,
    justifyContent:"space-between",
    flexDirection:"row",
    alignItems:"center",
    padding:15,
    marginBottom:6
  },
  accountInnerTabs:{
    justifyContent:"space-between",
    flexDirection:"row",
    alignItems:"center"
  },
  accountInnerTabsText:{
    marginLeft:10,
    fontWeight:"bold",
    fontSize:16
  }
});

export default AlarmScreen;
