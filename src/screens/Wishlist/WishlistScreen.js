import React, { useState,useRef,useEffect} from "react";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  FlatList,
  RefreshControl
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";

import COLORS from "../../constant/COLORS";
import BottomNavigation from "../../components/BottomNavigation";
import WishlistCard from "../../components/WishlistCard";
import WhishlistScreenLoader from "../../loaders/WhishlistScreenLoader";

import { db } from "../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth();

function WishlistScreen({navigation}) {
  const userId = useRef(null);

  const [refreshing, setRefreshing] = useState(false);

  const [wishlist,setWishlist] = useState(null);

  const onRefresh = async () => {
    await fetchWishlist();
    setRefreshing(false);
  };

  const isUserLogin = async () => {
    await onAuthStateChanged(auth, (user) => {
      if (user) {
        userId.current = user.uid;
        fetchWishlist();
      } else {
        navigation.navigate("Login", { name: "Login" });
      }
    });
  };

  const fetchWishlist = async () => {
    let tmpData = [];

    try {
      const q = query(
        collection(db, "tbl_wishlist"),
        where("userId", "==", userId.current)
      );
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        tmpData.push(doc.data().productId);
      });
    } catch (error) {
      console.error("Error fetching wishlist: ", error);
    }
    setWishlist(tmpData);

  };

  useEffect(() => {
    isUserLogin();
  }, []);

  return (
    <SafeAreaView style={[{ flex: 1 }, styles.defaults]}>
      <View style={[styles.header, styles.iosPadding]}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Icon name="arrow-back" size={32} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wishlist</Text>
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
        {wishlist ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={wishlist}
            renderItem={({ item }) => (
              <WishlistCard navigation={navigation} plantId={item} />
            )}

            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
          />
        ) : (
          <WhishlistScreenLoader />
        )}
      </View>

      <View style={styles.iosPadding}>
        <BottomNavigation navigation={navigation} screen="wishlist" />
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

export default WishlistScreen;
