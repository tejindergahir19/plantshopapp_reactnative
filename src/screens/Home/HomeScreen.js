import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  RefreshControl,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Icon from "react-native-vector-icons/MaterialIcons";

import ItemCard from "../../components/ItemCard";

import COLORS from "../../constant/COLORS";

import HomeScreenItemLoader from "../../loaders/HomeScreenItemLoader";
import HomeScreenCategoryLoader from "../../loaders/HomeScreenCategoryLoader";
import BottomNavigation from "../../components/BottomNavigation";

import { db } from "../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

import { getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth();

function HomeScreen({ navigation }) {
  const userId = useRef(null);

  const [refreshing, setRefreshing] = useState(false);

  const [categoryIndex, setCategoryIndex] = useState(0);

  const [isCategoryLoaded, setIsCategoryLoaded] = useState(false);
  const [categoryData, setCategoryData] = useState(null);

  const [isCardsLoaded, setIsCardsLoaded] = useState(false);
  const [plantData, setPlantData] = useState(null);

  const [wishlist, setWishlist] = useState(null);
  const [cartList,setCartList] = useState(null);

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

  const onRefresh = async () => {
    setIsCategoryLoaded(false);
    setIsCardsLoaded(false);
    setRefreshing(true);
    await fetchWishlist();
    await fetchCartList();
    setRefreshing(false);
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
        tmpData.push(doc.data());
      });
    } catch (error) {
      console.error("Error fetching wishlist: ", error);
    }

    setWishlist(tmpData);
    fetchCartList();
    fetchCategoryData();
  };

  const fetchCartList = async () => {
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
      console.error("Error fetching wishlist: ", error);
    }
    setCartList(tmpData);
  }

  const fetchCategoryData = async () => {
    let tmpData = [];
    try {
      const querySnapshot = await getDocs(collection(db, "tbl_categories"));
      querySnapshot.forEach((doc) => {
        tmpData.push(doc.data().category);
      });
    } catch (e) {
      console.log("error fetching data", e);
    }

    setCategoryData(tmpData);
    setIsCategoryLoaded(true);

    fetchPlantData();
  };

  const fetchPlantData = async () => {
    let tmpData = [];

    try {
      const querySnapshot = await getDocs(collection(db, "tbl_plant_data"));
      querySnapshot.forEach((doc) => {
        tmpData.push({
          id: doc.id,
          data: doc.data(),
        });
      });
    } catch (e) {
      console.log("error fetching data");
    }

    setPlantData(tmpData);
    setIsCardsLoaded(true);
  };

  useEffect(() => {
    isUserLogin();
  }, []);

  return (
    <SafeAreaView style={[{ flex: 1 }, styles.defaults]}>
      <View style={styles.header}>
        <View style={styles.title}>
          <Text style={styles.subHeading}>Welcome to</Text>
          <Text style={styles.Heading}>Plant Shop</Text>
        </View>
        <View style={styles.cart}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Cart",{refreshAll:onRefresh});
            }}
          >
            <Icon name="shopping-cart" size={32} color={COLORS.primary} />
            <View style={{
              backgroundColor:COLORS.primary,
              justifyContent:"center",
              alignItems:"center",
              borderRadius:50,
              position:"absolute",
              right:-2,
              top:-8,
              paddingHorizontal:5,
              paddingVertical:Platform.OS == "ios" ? 5 : 0
            }}>
              <Text style={{
                color:COLORS.white,
                fontWeight:"bold",
              }}>{cartList?.length ?? 
              <View style={{paddingVertical:5}}>
              <ActivityIndicator size={"small"} color={COLORS.white} />
              </View>
              }</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.search}>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Icon name="search" size={32} color={COLORS.primary} />
        </View>
        <View>
          <TextInput
            style={{ height: 40, width: 280 }}
            placeholder="Find your favorite plants..."
          />
        </View>
      </View>
      {isCategoryLoaded ? (
        <View style={styles.categories}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {categoryData?.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setCategoryIndex(index);
                }}
                style={
                  index === categoryIndex
                    ? styles.categoryButtonSelected
                    : styles.categoryButton
                }
              >
                <Text
                  style={
                    index === categoryIndex
                      ? styles.categoryButtonTextSelected
                      : styles.categoryButtonText
                  }
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      ) : (
        <View style={{ height: 60 }}>
          <HomeScreenCategoryLoader />
        </View>
      )}
      {isCardsLoaded ? (
        <>
          <View style={{ flex: 1, paddingVertical: 20 }}>
            <FlatList
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              showsVerticalScrollIndicator={false}
              columnWrapperStyle={{
                columnGap: 10,
              }}
              data={plantData}
              renderItem={({ item }) => (
                <ItemCard
                  navigation={navigation}
                  value={item}
                  wishlist={wishlist}
                  userId={userId.current}
                  cartList={cartList}

                  refreshAll={onRefresh}
                />
              )}
              keyExtractor={(item) => item.id}
              numColumns={2}
              initialNumToRender={2}

              ListEmptyComponent={
                <View style={{
                  flex:1,
                  height:240,
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
          </View>
        </>
      ) : (
        <View style={{ flex: 1 }}>
          <HomeScreenItemLoader />
        </View>
      )}
      <BottomNavigation navigation={navigation} refreshAll={onRefresh} screen="home" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  defaults: {
    backgroundColor: COLORS.primaryBackgroundColor,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subHeading: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.black,
  },
  Heading: {
    marginTop: 3,
    fontSize: 38,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  search: {
    backgroundColor: COLORS.grey,
    flexDirection: "row-reverse",
    alingItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    marginTop: 20,
  },
  categories: {
    marginTop: 20,
  },
  categoryButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: COLORS.primaryBackgroundColor,
    marginRight: 5,
    borderRadius: 6,
  },
  categoryButtonText: {
    textTransform: "uppercase",
    // fontWeight: "bold",
    color: COLORS.caption,
    fontSize: 14,
  },
  categoryButtonSelected: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: COLORS.primary,
    marginRight: 5,
    borderRadius: 6,
  },
  categoryButtonTextSelected: {
    textTransform: "uppercase",
    fontWeight: "bold",
    color: COLORS.primaryBackgroundColor,
    fontSize: 14,
  },
});

export default HomeScreen;
