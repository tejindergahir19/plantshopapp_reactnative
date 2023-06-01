import React, { useState,useRef,useEffect} from "react";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  FlatList,
  RefreshControl,
  BackHandler
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";

import COLORS from "../../constant/COLORS";
import BottomNavigation from "../../components/BottomNavigation";

import { db } from "../../firebase";
import { collection,doc, getDocs, getDoc,query, where } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import WaterCard from "../../components/WaterCard";
import WhishlistScreenLoader from "../../loaders/WhishlistScreenLoader";

const auth = getAuth();

function AlarmScreen({navigation,route}) {

  const refreshAll = route?.params?.refreshAll;

  const userId = useRef(null);
  const [refreshing, setRefreshing] = useState(false);

  const [waterPlant,setWaterPlant] = useState(null);

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

  const onRefresh = async () => {
    await fetchProductsFromOrders();
    setRefreshing(false);
  };

  const fetchProductsFromOrders = async () => {
    setWaterPlant(null);
    let tmpData = [];
    let tmpPlants = new Set();
    
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

      tmpData.flat().map((item)=>(
        tmpPlants.add(item)
      ))

      setWaterPlant(Array.from(tmpPlants));
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
        {
          waterPlant ? 
          (
            <FlatList
            showsVerticalScrollIndicator={false}
            data={waterPlant}
            renderItem={({ item,key}) => (
              <WaterCard key={key} refreshAll={refreshAll} navigation={navigation} plantId={item}/>
        
            )}

            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }

              ListEmptyComponent={
                <View style={{
                  flex:1,
                  height:320,
                  justifyContent:"flex-end",
                  alignItems:"center",
                }}>
                  <Text style={{
                    fontSize:16,
                    color:COLORS.caption
                  }}>No Records Found</Text>
                </View>
              }
          />
          ) : <WhishlistScreenLoader />
        }
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
