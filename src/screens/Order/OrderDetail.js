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
  BackHandler
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
updateDoc
} from "firebase/firestore";

import { getAuth, onAuthStateChanged } from "firebase/auth";

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
        <Text style={styles.headerTitle}>Order Detail</Text>
        <View>
          <TouchableOpacity>
            <Icon name="add" color={COLORS.primaryBackgroundColor} size={24} />
          </TouchableOpacity>
        </View>
      </View>
      {true ? (
        <View style={{ flex: 1 }}>
            <Text>{orderDetail.status}</Text>
        </View>
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
  category: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginTop: 25,
  },
  categoryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  categoryButtonText: {
    color: COLORS.primaryBackgroundColor,
    textTransform: "uppercase",
    fontSize: 12,
    fontWeight: "bold",
  },
  itemImage: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 2,
  },
  itemTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 15,
  },
  availableText: {
    marginTop: 2,
    // fontWeight: "bold",
  },
  itemTitleText: {
    color: COLORS.primary,
    fontWeight: "bold",
    fontSize: 24,
    textTransform: "capitalize",
  },
  review: {
    flexDirection: "row",
    alignItems: "center",
  },
  reviewCount: {
    fontWeight: "bold",
    fontSize: 16,
  },
  desc: {
    marginTop: 8,
  },
  descText: {
    fontSize: 16,
    textAlign: Platform.OS === "ios" ? "justify" : "auto",
    color: COLORS.caption,
  },
  about: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 18,
  },
  aboutTitle: {
    color: COLORS.caption,
    fontSize: 12,
    fontWeight: "bold",
  },
  aboutValue: {
    color: COLORS.primary,
    textTransform: "capitalize",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 5,
  },
  bottomSection: {
    marginTop: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceValue: {
    color: COLORS.primary,
    textTransform: "capitalize",
    fontWeight: "bold",
    fontSize: 28,
    marginTop: 3,
  },
  addToCartButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 6,
  },
  addToCartText: {
    fontWeight: "bold",
    fontSize: 18,
    color: COLORS.primaryBackgroundColor,
    textTransform: "capitalize",
  },
  addedToCartButton: {
    backgroundColor: COLORS.caption,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 6,
  },
  addedToCartText: {
    fontWeight: "bold",
    fontSize: 18,
    color: COLORS.white,
    textTransform: "capitalize",
  },
});

export default OrderDetail;
