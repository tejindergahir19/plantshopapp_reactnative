import React, { useState, useEffect, useRef } from "react";
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Image,
  Platform,
  Alert,
  Vibration,
  Pressable,
} from "react-native";
import COLORS from "../constant/COLORS";

import Icon from "react-native-vector-icons/Ionicons";

import { db } from "../firebase";
import {
  doc,
  getDoc,
  getDocs,
  query,
  where,
  collection,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

import { getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth();

function CartItemCard(props) {
  const userId = useRef(null);
  const {
    plantId,
    quantity,
    navigation,
    updateSubTotal,
    refreshCartList,
    refreshAll,
  } = props;

  const itemQuantity = useRef(quantity);
  const [plantQuantity, setPlantQuantity] = useState(quantity);

  const [value, setValue] = useState(null);

  const price = useRef(0);

  const isUserLogin = async () => {
    await onAuthStateChanged(auth, (user) => {
      if (user) {
        userId.current = user.uid;
        fetchPlantData();
      } else {
        navigation.navigate("Login", { name: "Login" });
      }
    });
  };

  const fetchPlantData = async () => {
    let querySnapshot;
    try {
      querySnapshot = await getDoc(doc(db, "tbl_plant_data", plantId));
    } catch (error) {
      console.error("Error fetching data: ", error);
      return;
    }
    setValue(querySnapshot.data());

    price.current = Number(querySnapshot.data().price);

    updateSubTotal(price.current * itemQuantity.current);
  };

  const addItem = () => {
    if (value?.unit != 0) {
      setPlantQuantity((itemQuantity.current += 1));
      updateSubTotal(price.current);
      updateQuantity("add");
    } else {
      Alert.alert("No More Plants Available !");
    }
    Vibration.vibrate();
  };

  const subItem = () => {
    setPlantQuantity(
      itemQuantity.current != 1
        ? (itemQuantity.current -= 1)
        : itemQuantity.current
    );

    updateSubTotal(price.current * -1);
    updateQuantity("sub");

    Vibration.vibrate();
  };

  const updateQuantity = async (type) => {
    let docRef = doc(db, "tbl_plant_data", plantId);
    try {
      await updateDoc(docRef, {
        unit: type == "add" ? value?.unit - 1 : value?.unit + 1,
      });
    } catch (error) {
      console.log("Not able to update", error);
    }

    type == "add" ? (value.unit -= 1) : (value.unit += 1);

    cartUpdateQuantity(type);
  };

  const completeUpdateQuantity = async () => {
    let docRef = doc(db, "tbl_plant_data", plantId);
    try {
      await updateDoc(docRef, {
        unit: value?.unit + itemQuantity.current,
      });
    } catch (error) {
      console.log("Not able to update", error);
    }
  };

  const cartUpdateQuantity = async (type) => {
    const q = query(
      collection(db, "tbl_cart"),
      where("userId", "==", userId.current),
      where("productId", "==", plantId)
    );
    const querySnapshot = await getDocs(q);

    let docRef = doc(db, "tbl_cart", querySnapshot?.docs[0]?.id);

    try {
      await updateDoc(docRef, {
        quantity:
          type == "add"
            ? querySnapshot?.docs[0]?.data()?.quantity + 1
            : querySnapshot?.docs[0]?.data()?.quantity - 1,
      });
    } catch (error) {
      console.log("Not able to update", error);
    }
  };

  const removeFromCart = async () => {
    const q = query(
      collection(db, "tbl_cart"),
      where("userId", "==", userId.current),
      where("productId", "==", plantId)
    );
    const querySnapshot = await getDocs(q);

    querySnapshot.docs[0] &&
      (await deleteDoc(doc(db, "tbl_cart", querySnapshot.docs[0].id)));

    completeUpdateQuantity();
    refreshCartList();
  };

  useEffect(() => {
    isUserLogin();
  }, []);

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("Detail", {
          plantId: plantId,
          refreshAll: refreshAll,
        });
      }}
      style={styles.itemCard}
    >
      <View style={styles.infoSection}>
        <View style={styles.itemImg}>
          <Image
            source={require("../assets/plant1.png")}
            style={{ width: 65, height: 70 }}
          />
        </View>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text style={styles.title}>
            {value?.title.length > 24
              ? value?.title.slice(0, 30) + "..."
              : value?.title}
          </Text>

          <View style={styles.footerItem}>
            <Text style={styles.price}>
              {value?.price} {value?.currency}
            </Text>
          </View>
        </View>
        <View style={styles.addToWishlist}>
          <TouchableOpacity
            onPress={() => {
              removeFromCart();
            }}
          >
            <Icon name="close" color={COLORS.red} size={24} />
          </TouchableOpacity>

          <View style={styles.quantityMeasure}>
            {itemQuantity.current != 1 ? (
              <TouchableOpacity
                onPress={() => {
                  subItem();
                }}
                style={styles.sub}
              >
                <Text style={styles.subText}>-</Text>
              </TouchableOpacity>
            ) : (
              <Pressable style={styles.subDisable}>
                <Text style={styles.subText}>-</Text>
              </Pressable>
            )}

            <Text style={styles.quantity}>
              {plantQuantity < 10 && 0}
              {plantQuantity}
            </Text>

            <TouchableOpacity
              onPress={() => {
                addItem();
              }}
              style={styles.add}
            >
              <Text style={styles.addText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  itemCard: {
    flex: 1,
    backgroundColor: COLORS.grey,
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
    flexDirection: "column",
  },
  stockLeftView: {
    flexDirection: "row-reverse",
    justifyContent: "center",
  },
  stockLeft: {
    color: COLORS.red,
    fontSize: Platform.OS == "ios" ? 11 : 10,
    fontWeight: "bold",
  },
  addToWishlist: {
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  infoSection: {
    flexDirection: "row",
  },
  itemImg: {
    justifyContent: "center",
    alignItems: "flex-start",
    marginRight: 6,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    textTransform: "capitalize",
    color: COLORS.black,
  },
  footerItem: {
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: "bold",
  },
  quantityMeasure: {
    flexDirection: "row",
  },
  sub: {
    backgroundColor: COLORS.primary,
    borderRadius: 6,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    width: 26,
    height: 26,
  },
  subDisable: {
    backgroundColor: COLORS.primary,
    borderRadius: 6,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    width: 26,
    height: 26,
    opacity: 0.3,
  },
  subText: {
    color: COLORS.white,
    fontSize: 18,
  },
  add: {
    backgroundColor: COLORS.primary,
    borderRadius: 6,
    marginLeft: 12,
    justifyContent: "center",
    alignItems: "center",
    width: 26,
    height: 26,
  },
  addText: {
    color: COLORS.white,
    fontSize: 16,
  },
  quantity: {
    fontSize: 16,
    marginTop: Platform.OS == "ios" ? 3 : 0,
  },
});

export default CartItemCard;
