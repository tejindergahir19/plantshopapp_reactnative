import React,{useState,useRef,useEffect} from "react";
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

function ItemCard(props) {
  const { value, navigation,userId} = props;

  const plantId = value.id;

  const [inWishlist, setInWishlist] = useState(false);
  const [showWishlistIcon, setShowWishlistIcon] = useState(false);

  const checkInWishlist = async () => {
    try {
      const q = query(
        collection(db, "tbl_wishlist"),
        where("userId", "==", userId),
        where("productId", "==", plantId)
      );
      const querySnapshot = await getDocs(q);

      const isInWishlist = querySnapshot.docs.length > 0;
      setInWishlist(isInWishlist);
    } catch (error) {
      console.error("Error checking wishlist: ", error);
    }
    setShowWishlistIcon(true);
    console.log("called")
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

  useEffect(()=>{
    checkInWishlist();
  },[])

  return (
    <TouchableOpacity
      key={Math.random()}
      onPress={() => {
        navigation.navigate("Detail", value?.id);
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
      </View>
      <View style={styles.itemImg}>
        <Image
          source={{
            uri:"https://i.ibb.co/M1SgjH3/plant1.png"
          }}
          style={{ width: 130, height: 130 }}
        />
      </View>

      <Text style={styles.title}>
        {value?.data?.title?.length > 24
          ? value?.data?.title.slice(0, 24) + "..."
          : value?.data?.title}
      </Text>
      <View style={styles.footerItem}>
        <Text style={styles.price}>
          {value?.data?.price} {value?.data?.currency}
        </Text>

        <View style={styles.cartButton}>
          <TouchableOpacity>
            <Text>
              <Icon name="cart-outline" size={24} />
            </Text>
          </TouchableOpacity>
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
