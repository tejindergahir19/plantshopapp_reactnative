import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
  ActivityIndicator,
  Alert,
  Vibration,
  BackHandler,
  ScrollView,
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";

import COLORS from "../../constant/COLORS";

import DetailScreenLoader from "../../loaders/DetailScreenLoader";
import Rating from "../../components/Rating";

import { db } from "../../firebase";
import {
  doc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  collection,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import OrderItemCard from "../../components/OrderItemCard";

const auth = getAuth();

function OrderDetail({ navigation, route }) {
  const orderId = route?.params?.orderId;
  const orderDetail = route?.params?.orderDetail;
  const refreshAll = route?.params?.refreshAll;

  const userId = useRef(null);

  const isUserLogin = async () => {
    await onAuthStateChanged(auth, (user) => {
      if (user) {
        userId.current = user.uid;
      } else {
        navigation.navigate("Login", { name: "Login" });
      }
    });
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case "delivered":
      case "accepted":
        return COLORS.primary;

      case "out for delivery":
        return COLORS.orange;

      case "cancelled":
        return COLORS.red;

      default:
        return COLORS.caption;
    }
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
        <Text style={styles.headerTitle}>Order Detail</Text>
        <View>
          <TouchableOpacity>
            <Icon name="add" color={COLORS.primaryBackgroundColor} size={24} />
          </TouchableOpacity>
        </View>
      </View>
      {true ? (
        <ScrollView
          style={{
            flex: 1,
            paddingVertical: 20,
            paddingHorizontal: Platform.OS == "ios" ? 20 : 0,
          }}
        >
          <View
            style={styles.orderDetail}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              Order ID
            </Text>
            <Text
              style={{
                color: COLORS.primary,
              }}
            >
              {orderId}
            </Text>
          </View>
          <View
            style={[
              {
              marginTop: 6,
            }, styles.orderDetail]}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              Order Date 
            </Text>
            <Text
              style={{
                color: COLORS.primary,
              }}
            >
              {orderDetail.date} | {orderDetail.time}
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: COLORS.grey,
              marginVertical: 12,
            }}
          ></View>

          <View>
            {orderDetail?.items?.map((item, key) => (
              <OrderItemCard
                key={key}
                plantData={item}
                navigation={navigation}
                refreshAll={refreshAll}
              />
            ))}
          </View>

          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: COLORS.grey,
              marginVertical: 12,
              marginTop: 5,
            }}
          ></View>

          <View style={styles.totalAmount}>
            <View style={styles.subTotal}>
              <Text style={styles.subTotalText}>Sub total</Text>
              <Text style={styles.subTotalAmountText}>
                {orderDetail.subTotal} ₹
              </Text>
            </View>
            <View style={styles.delivery}>
              <Text style={styles.deliveryText}>Delivery</Text>
              <Text style={styles.deliveryAmountText}>
                {orderDetail.delivery} ₹
              </Text>
            </View>

            <View style={styles.total}>
              <Text style={styles.totalText}>Total</Text>
              <Text style={styles.totalAmountText}>
                {orderDetail.subTotal + orderDetail.delivery} ₹
              </Text>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              height: 3,
              backgroundColor: COLORS.grey,
              marginVertical: 20,
              marginTop: 5,
            }}
          ></View>
          <View
             style={[
               styles.orderDetail]}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              Order Status
            </Text>
            <View
              style={[
                styles.statusButton,
                {
                  backgroundColor: getStatusBgColor(
                    orderDetail?.status.toLowerCase()
                  ),
                },
              ]}
            >
              <Text style={styles.statusText}>{orderDetail?.status}</Text>
            </View>
          </View>

          <View
            style={[
              {
              marginTop: 15,
            }, styles.orderDetail]}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              Payment Type  
            </Text>
            <Text
              style={{
                color: COLORS.primary,
              }}
            >
              Cash / Pay on Delivery
            </Text>
          </View>
        </ScrollView>
      ) : (
        <View style={{ paddingHorizontal: Platform.OS == "ios" ? 20 : 0 }}>
          <DetailScreenLoader />
        </View>
      )}
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
  totalAmount: {
    paddingVertical: 12,
  },
  subTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 8,
    borderBottomColor: COLORS.grey,
    borderBottomWidth: Platform.OS == "ios" ? 1 : 2,
    borderStyle: Platform.OS == "ios" ? "solid" : "dashed",
  },
  subTotalText: {
    color: COLORS.caption,
    fontSize: 16,
  },
  subTotalAmountText: {
    color: COLORS.caption,
    fontSize: 16,
    fontWeight: "bold",
  },
  delivery: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 18,
    borderBottomColor: COLORS.grey,
    borderBottomWidth: 3,
  },
  deliveryText: {
    color: COLORS.caption,
    fontSize: 16,
  },
  deliveryAmountText: {
    color: COLORS.caption,
    fontSize: 16,
    fontWeight: "bold",
  },
  total: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 18,
  },
  totalText: {
    color: COLORS.caption,
    fontSize: 20,
    fontWeight: "bold",
  },
  totalAmountText: {
    color: COLORS.primary,
    fontSize: 22,
    fontWeight: "bold",
  },
  checkOutButton: {
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 6,
    marginTop: 24,
  },
  checkOutButtonDisable: {
    backgroundColor: COLORS.caption,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 6,
    marginTop: 24,
  },
  checkOutButtonText: {
    fontWeight: "bold",
    fontSize: 18,
    color: COLORS.primaryBackgroundColor,
    textTransform: "capitalize",
  },
  statusButton: {
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  statusText: {
    fontWeight: "bold",
    color: COLORS.white,
    fontSize: 12,
    textTransform: "capitalize",
  },
  orderDetail:{
    flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
  }
});

export default OrderDetail;
