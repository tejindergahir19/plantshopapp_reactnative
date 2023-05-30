import React, { useState, useRef, useEffect } from "react";
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Image,
  Platform,
  ActivityIndicator,
  FlatList,
  Alert,
  Vibration,
} from "react-native";
import COLORS from "../constant/COLORS";

import Icon from "react-native-vector-icons/Ionicons";

import { db } from "../firebase";
import {
  doc,
  getDocs,
  query,
  where,
  addDoc,
  collection,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

function isDataPresent(arr, data) {
  return arr.some((obj) => Object.values(obj).includes(data));
}

function ItemCard(props) {
  const {value, navigation, userId, wishlist, cartList,refreshAll,updateCartListLength} = props;

  const plantId = value.id;

  const [inWishlist, setInWishlist] = useState(false);
  const [showWishlistIcon, setShowWishlistIcon] = useState(false);
  const [inCartList, setInCartList] = useState(false);
  const [showCartIcon, setShowCartIcon] = useState(false);

  const checkInWishlist = async () => {
    setInWishlist(isDataPresent(wishlist, plantId));
    setShowWishlistIcon(true);
  };

  const checkInCartList = async () => {
    setInCartList(isDataPresent(cartList, plantId));
    setShowCartIcon(true);
  };

  const handleWishlist = async () => {
    try {
      setShowWishlistIcon(false);

      if (!inWishlist) {
        await addDoc(collection(db, "tbl_wishlist"), {
          userId: userId,
          productId: plantId,
        });

        setInWishlist(true);
      } else {
        const q = query(
          collection(db, "tbl_wishlist"),
          where("userId", "==", userId),
          where("productId", "==", plantId)
        );
        const querySnapshot = await getDocs(q);

        querySnapshot.docs[0] &&
          (await deleteDoc(doc(db, "tbl_wishlist", querySnapshot.docs[0].id)));

        setInWishlist(false);
      }

      setShowWishlistIcon(true);
    } catch (error) {
      console.error("Error handling wishlist: ", error);
    }
  };

  const updateQuantity = async () => {
    console.log(value.unit);
    const docRef = doc(db, "tbl_plant_data", plantId);
    try {
      await updateDoc(docRef, {
        unit: value?.data?.unit - 1
      });
    } catch (error) {
      console.log("Not able to update", error);
    }

    console.log("done");
  };

  const handleAddToCart = async () => {
    setShowCartIcon(false);
    try {
      const doc = await addDoc(collection(db, "tbl_cart"), {
        userId: userId,
        productId: plantId,
        quantity: 1,
      });
      updateQuantity();
      setInCartList(true);
      Alert.alert("Product Added to Cart");
      Vibration.vibrate();
      updateCartListLength();
    } catch (error) {
      console.error("Error handling cart: ", error);
    }
    setShowCartIcon(true);
  };

  useEffect(() => {
    checkInWishlist();
    checkInCartList();
  }, []);

  return (
    <TouchableOpacity
      key={value?.id}
      onPress={() => {
        navigation.navigate("Detail",{plantId:value?.id,refreshAll:refreshAll});
      }}
      style={styles.itemCard}
    >
      <View style={styles.addToWishlist}>
        {showWishlistIcon ? (
          <TouchableOpacity
            onPress={() => {
              handleWishlist();
            }}
          >
            <Icon
              name={inWishlist ? "heart" : "heart-outline"}
              color={COLORS.red}
              size={24}
            />
          </TouchableOpacity>
        ) : (
          <ActivityIndicator color={COLORS.red} size="small" />
        )}
        {value?.data?.unit <= 5 && value?.data?.unit > 0 && (
          <Text style={styles.stockLeft}>
            Hurry Only {value?.data?.unit} left !
          </Text>
        )}
        {value?.data?.unit == 0 && (
          <Text style={styles.stockLeft}>Out of Stock</Text>
        )}
      </View>
      <View style={styles.itemImg}>
        <Image
          source={{
            uri: value?.data?.img,
          }}
          style={{ width: 130, height: 130 }}
        />
      </View>

      <Text style={styles.title}>
        {value?.data?.title?.length > 12
          ? value?.data?.title.slice(0, 12) + "..."
          : value?.data?.title}
      </Text>
      <View style={styles.footerItem}>
        <Text style={styles.price}>
          {value?.data?.price} {value?.data?.currency}
        </Text>

        <View style={styles.cartButton}>
          {showCartIcon ? (
            <TouchableOpacity
              onPress={() => {
                value?.data?.unit != 0 && !inCartList && handleAddToCart();
                inCartList && Alert.alert("Already in Cart !");
                inCartList && Vibration.vibrate();
              }}
            >
              {
                value?.data?.unit != 0 && <Text>
                <Icon
                  name={inCartList ? "cart" : "cart-outline"}
                  color={inCartList ? COLORS.primary : COLORS.black}
                  size={24}
                />
              </Text>
              }
            </TouchableOpacity>
          ) : (
            <ActivityIndicator color={COLORS.black} size="small" />
          )}
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
  },
  stockLeft: {
    color: COLORS.red,
    fontSize: Platform.OS == "ios" ? 11 : 10,
    fontWeight: "bold",
  },
  addToWishlist: {
    alignItems: "center",
    flexDirection: "row-reverse",
    justifyContent: "space-between",
  },
  itemImg: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    textTransform: "capitalize",
    marginTop: 20,
    color: COLORS.black,
  },
  footerItem: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ItemCard;
