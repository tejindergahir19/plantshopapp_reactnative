import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  FlatList,
  BackHandler,
  RefreshControl,
  Alert,
  Vibration,
  ActivityIndicator,
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";

import COLORS from "../../constant/COLORS";
import WhishlistScreenLoader from "../../loaders/WhishlistScreenLoader";
import CartItemCard from "../../components/CartItemCard";

import { db } from "../../firebase";
import {
  getDocs,
  query,
  where,
  collection,
  deleteDoc,
  doc,
  addDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth();

function CartScreen({ navigation, route }) {
  const refreshAll = route?.params?.refreshAll;

  const userId = useRef(null);

  const [refreshing, setRefreshing] = useState(false);

  const [cartList, setCartList] = useState(null);

  //bill details
  const subTotal = useRef(0);
  const delivery = useRef(30);

  const [showSubtotal, setShowSubtotal] = useState(0);
  const [showDelivery, setShowDelivery] = useState(delivery.current);
  const [showTotal, setShowTotal] = useState(0);

  const [isUserDataExists, setIsUserDataExists] = useState(false);

  const [showAddToCartLoader, setShowAddToCartLoader] = useState(false);

  const onRefresh = async () => {
    await fetchCartList();
    setRefreshing(false);
    subTotal.current = 0;
    setShowSubtotal(subTotal.current);
    setShowTotal(subTotal.current + delivery.current);
    refreshAll();
  };

  const isUserLogin = async () => {
    await onAuthStateChanged(auth, (user) => {
      if (user) {
        userId.current = user.uid;
        checkUserDataExists();
        fetchCartList();
      } else {
        navigation.navigate("Login", { name: "Login" });
      }
    });
  };

  const fetchCartList = async () => {
    setCartList(null);

    let tmpData = [];

    try {
      const q = query(
        collection(db, "tbl_cart"),
        where("userId", "==", userId.current)
      );
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        tmpData.push(doc.data());
      });
    } catch (error) {
      console.error("Error fetching Cart list: ", error);
    }
    setCartList(tmpData);

    console.log(tmpData);
  };

  const updateSubTotal = (amount) => {
    subTotal.current += amount;
    setShowSubtotal(subTotal.current);
    setShowTotal(subTotal.current + delivery.current);
  };

  const checkUserDataExists = async () => {
    try {
      const q = query(
        collection(db, "tbl_user"),
        where("userId", "==", userId.current)
      );
      const querySnapshot = await getDocs(q);

      setIsUserDataExists(querySnapshot.docs.length > 0);
    } catch (error) {
      console.error("Error checking user: ", error);
    }
  };

  const placeOrder = async () => {
    const date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    // This arrangement can be altered based on how we want the date's format to appear.
    let currentDate = `${day}-${month}-${year}`;

    let hr = date.getHours();
    let min = date.getMinutes();
    let sec = date.getSeconds();

    let currentTime = `${hr}:${min}:${sec}`;
  
    setShowAddToCartLoader(true);

    if (isUserDataExists) {
      let tmpData = [];
      let tmpDocId = [];

      const q = query(
        collection(db, "tbl_cart"),
        where("userId", "==", userId.current)
      );
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        tmpDocId.push(doc.id);
        tmpData.push(doc.data());
      });

      await addDoc(collection(db, "tbl_orders"), {
        userId: userId.current,
        items: tmpData,
        subTotal: subTotal.current,
        delivery: delivery.current,
        date:currentDate,
        time:currentTime,
        status:"Pending"
      });

      tmpDocId.forEach(
        async (item) => await deleteDoc(doc(db, "tbl_cart", item))
      );

      refreshAll();
      Alert.alert("Order Placed !");
      Vibration.vibrate();
      navigation.navigate("Home", { refreshAll: refreshAll });
    } else {
      setShowAddToCartLoader(false);
      Alert.alert("Please first complete your profile");
      Vibration.vibrate();
      navigation.navigate("Profile", { refreshAll: refreshAll });
    }

    setShowAddToCartLoader(false);
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
        <Text style={styles.headerTitle}>Cart</Text>
        <View>
          <TouchableOpacity>
            <Icon
              name="heart-outline"
              color={COLORS.primaryBackgroundColor}
              size={24}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[{ flex: 1, paddingVertical: 20 }, styles.iosPadding]}>
        {cartList ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={cartList}
            renderItem={({ item }) => (
              <CartItemCard
                updateSubTotal={updateSubTotal}
                refreshCartList={onRefresh}
                refreshAll={refreshAll}
                navigation={navigation}
                plantId={item.productId}
                quantity={item.quantity}
              />
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <View
                style={{
                  flex: 1,
                  height: 260,
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

      <View style={[styles.totalAmount, styles.iosPadding]}>
        <View style={styles.subTotal}>
          <Text style={styles.subTotalText}>Sub total</Text>
          <Text style={styles.subTotalAmountText}>{showSubtotal} ₹</Text>
        </View>
        <View style={styles.delivery}>
          <Text style={styles.deliveryText}>Delivery</Text>
          <Text style={styles.deliveryAmountText}>
            {subTotal.current != 0 ? showDelivery : 0} ₹
          </Text>
        </View>

        <View style={styles.total}>
          <Text style={styles.totalText}>Total</Text>
          <Text style={styles.totalAmountText}>
            {subTotal.current != 0 ? showTotal : 0} ₹
          </Text>
        </View>
        <Text style={{
          color: COLORS.primary,
          marginTop: 8,
          fontSize: 12
        }}>Payment: Cash on Delivery / PayOnline on Delivery</Text>

        {cartList != 0 ? (
          <TouchableOpacity
            onPress={() => {
              placeOrder();
            }}
            style={styles.checkOutButton}
          >
            {showAddToCartLoader ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <Text style={styles.checkOutButtonText}>place order</Text>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.checkOutButtonDisable}>
            <Text style={styles.checkOutButtonText}>place order</Text>
          </TouchableOpacity>
        )}
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
});

export default CartScreen;
