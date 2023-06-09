import React, { useState, useRef, useEffect } from "react";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  BackHandler,
  FlatList,
  RefreshControl,
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";

import COLORS from "../../constant/COLORS";
import BottomNavigation from "../../components/BottomNavigation";

import { db } from "../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import WhishlistScreenLoader from "../../loaders/WhishlistScreenLoader";
import OrderCard from "../../components/OrderCard";

const auth = getAuth();

function OrderScreen({ navigation, route }) {
  const refreshAll = route?.params?.refreshAll;

  const userId = useRef(null);

  const [refreshing, setRefreshing] = useState(false);

  const [orderList, setOrderList] = useState(null);

  const onRefresh = async () => {
    await fetchOrderList();
    setRefreshing(false);
  };

  const isUserLogin = async () => {
    await onAuthStateChanged(auth, (user) => {
      if (user) {
        userId.current = user.uid;
        fetchOrderList();
      } else {
        navigation.navigate("Login", { name: "Login" });
      }
    });
  };

  const fetchOrderList = async () => {
    setOrderList(null);

    let tmpData = [];

    try {
      const q = query(
        collection(db, "tbl_orders"),
        where("userId", "==", userId.current)
      );
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        tmpData.push({
          orderId: doc.id,
          orderDetail: doc.data(),
        });
      });
    } catch (error) {
      console.error("Error fetching wishlist: ", error);
    }
    setOrderList(
      tmpData.sort((a, b) => {
        const [a_day, a_month, a_year] = a.orderDetail.date.split("-");
        const [a_hour, a_min, a_sec] = a.orderDetail.time.split(":");

        const [b_day, b_month, b_year] = b.orderDetail.date.split("-");
        const [b_hour, b_min, b_sec] = b.orderDetail.time.split(":");

        const time1 = new Date(`${a_year}-${a_month}-${a_day}T${a_hour}:${a_min}:${a_sec.split(" ")[0]}`);
        const time2 = new Date(`${b_year}-${b_month}-${b_day}T${b_hour}:${b_min}:${b_sec.split(" ")[0]}`);

        return time2 - time1;
      })
    );
  };

  useEffect(() => {
    isUserLogin();

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
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
        <Text style={styles.headerTitle}>Orders</Text>
        <View>
          <TouchableOpacity>
            <Icon name="log-out-outline" color={COLORS.white} size={24} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[{ flex: 1, paddingVertical: 20 }, styles.iosPadding]}>
        {orderList ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={orderList}
            renderItem={({ item }) => (
              <OrderCard
                refreshAll={refreshAll}
                navigation={navigation}
                orderId={item.orderId}
                orderDetail={item.orderDetail}
              />
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <View
                style={{
                  flex: 1,
                  height: 320,
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: COLORS.caption,
                  }}
                >
                  No Records Found
                </Text>
              </View>
            }
          />
        ) : (
          <WhishlistScreenLoader />
        )}
      </View>

      <View style={styles.iosPadding}>
        <BottomNavigation
          navigation={navigation}
          refreshAll={refreshAll}
          screen="order"
        />
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
});

export default OrderScreen;
