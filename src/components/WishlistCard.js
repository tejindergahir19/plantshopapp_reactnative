import React, { useState, useEffect,useRef} from "react";
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Image,
  Platform,
  ActivityIndicator
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
  addDoc,
  collection,
  deleteDoc,
} from "firebase/firestore";

import { getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth();

function WishlistCard(props) {

  const userId = useRef(null);

  const {plantId, navigation,refreshWishlist, refreshAll} = props;

  const [inWishlist, setInWishlist] = useState(true);
  const [showWishlistIcon, setShowWishlistIcon] = useState(true);

  const [value, setValue] = useState(null);

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
  };

  const handleWishlist = async () => {
    try {
      setShowWishlistIcon(false);

      if (!inWishlist) {
        await addDoc(collection(db, "tbl_wishlist"), {
          userId: userId.current,
          productId: plantId,
        });

        setInWishlist(true);
      } else {
        const q = query(
          collection(db, "tbl_wishlist"),
          where("userId", "==", userId.current),
          where("productId", "==", plantId)
        );
        const querySnapshot = await getDocs(q);

        querySnapshot.docs[0] &&
          (await deleteDoc(doc(db, "tbl_wishlist", querySnapshot.docs[0].id)));

        setInWishlist(false);

        refreshWishlist();
      }

      setShowWishlistIcon(true);
    } catch (error) {
      console.error("Error handling wishlist: ", error);
    }
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
            source={{
              uri:value?.img
            }}
            style={{ width: 65, height: 70 }}
          />
        </View>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text style={styles.title}>
            {value?.title?.length > 24
              ? value?.title?.slice(0, 30) + "..."
              : value?.title}
          </Text>

          <View style={styles.footerItem}>
            <Text style={styles.price}>
              {value?.price} {value?.currency}
            </Text>
          </View>
        </View>
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
    justifyContent: "center",
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
});

export default WishlistCard;
