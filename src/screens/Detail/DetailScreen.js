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
  Alert
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
} from "firebase/firestore";

import { getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth();

function DetailScreen({ navigation, route }) {
  const plantId = route?.params;

  const userId = useRef(null);

  const [value, setValue] = useState(null);

  const [isDataFetched, setIsDataFetched] = useState(false);

  const [inWishlist, setInWishlist] = useState(false);
  const [showWishlistIcon, setShowWishlistIcon] = useState(false);

  const [inCart,setInCart] =  useState(false);
  const [showCartButton,setShowCartButton] = useState(false);

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
    setIsDataFetched(true);
    checkInWishlist();
    checkInCart();
  };

  const checkInWishlist = async () => {
    try {
      const q = query(
        collection(db, "tbl_wishlist"),
        where("userId", "==", userId.current),
        where("productId", "==", plantId)
      );
      const querySnapshot = await getDocs(q);

      const isInWishlist = querySnapshot.docs.length > 0;
      setInWishlist(isInWishlist);
    } catch (error) {
      console.error("Error checking wishlist: ", error);
    }
    setShowWishlistIcon(true);
  };

  const checkInCart = async () => {

    try{
      const q = query(
        collection(db,"tbl_cart"),
        where("userId","==",userId.current),
        where("productId","==",plantId)
      );

      const querySnapshot = await getDocs(q);

      const isInCart = querySnapshot.docs.length > 0;
      setInCart(isInCart);
    }catch(error){
      console.error("Error checking wishlist: ", error);
    }

    setShowCartButton(true);
  }

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
      }

      setShowWishlistIcon(true);
    } catch (error) {
      console.error("Error handling wishlist: ", error);
    }
  };

  const handleAddToCart = async () => {
    setShowCartButton(false);
      try{
        await addDoc(collection(db, "tbl_cart"), {
          userId: userId.current,
          productId: plantId,
          quantity: 1
        });
        setInCart(true);
      }catch(error){
        console.error("Error handling cart: ", error);
      }
      setShowCartButton(true);
    }

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
        <Text style={styles.headerTitle}>Details</Text>
        <View>
          <TouchableOpacity>
            <Icon name="add" color={COLORS.primaryBackgroundColor} size={24} />
          </TouchableOpacity>
        </View>
      </View>
      {isDataFetched ? (
        <View style={{ flex: 1 }}>
          <View style={[styles.category, styles.iosPadding]}>
            <View>
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
            <View style={styles.categoryButton}>
              <Text style={styles.categoryButtonText}>{value?.category}</Text>
            </View>
          </View>

          <View style={styles.itemImage}>
            <Image
              style={{
                width: 350,
                height: 350,
              }}
              source={
                {
                  uri:value?.img
                }
              }
            />
          </View>
          <View style={[styles.itemTitle, styles.iosPadding]}>
            <Text style={styles.itemTitleText}>{value?.title}</Text>
            <Text style={styles.review}>
              <Rating num={value?.rating} />
            </Text>
          </View>
          <View style={[styles.subHeader, styles.iosPadding]}>
            <Text
              style={[
                styles.availableText,
                {
                  color:
                    value?.unit > 10
                      ? COLORS.black
                      : value?.unit > 3
                      ? COLORS.orange
                      : COLORS.red,
                },
              ]}
            >
              Available: {value?.unit}
            </Text>
          </View>
          <View style={[styles.desc, styles.iosPadding]}>
            <Text style={styles.descText}>
              {value?.description?.slice(0, 180) + "..."}
            </Text>
          </View>
          <View style={[styles.about, styles.iosPadding]}>
            <View style={styles.aboutCard}>
              <Text style={styles.aboutTitle}>Size</Text>
              <Text style={styles.aboutValue}>{value?.size}</Text>
            </View>
            <View style={styles.aboutCard}>
              <Text style={styles.aboutTitle}>Plant</Text>
              <Text style={styles.aboutValue}>{value?.plantType}</Text>
            </View>
            <View style={styles.aboutCard}>
              <Text style={styles.aboutTitle}>Height</Text>
              <Text style={styles.aboutValue}>{value?.height}"</Text>
            </View>
            <View style={styles.aboutCard}>
              <Text style={styles.aboutTitle}>Humidity</Text>
              <Text style={styles.aboutValue}>{value?.humidity}%</Text>
            </View>
          </View>
          <View style={[styles.bottomSection, styles.iosPadding]}>
            <View style={styles.aboutCard}>
              <Text style={styles.aboutTitle}>Price</Text>
              <Text style={styles.priceValue}>
                {value?.price} {value?.currency}
              </Text>
            </View>
            <View style={styles.aboutCard}>
             <TouchableOpacity onPress={
                ()=>{
                  (value?.unit != 0 && !inCart) && handleAddToCart();
                }
              } style={(inCart || value?.unit == 0 ? styles.addedToCartButton : styles.addToCartButton)}>
              {
                showCartButton ? <Text style={(inCart  ? styles.addedToCartText : styles.addToCartText)}>{
                  value?.unit == "0" ?
                  "Not Available" : (inCart ? "Added to cart" : "Add to cart")
                }</Text> :
                <ActivityIndicator size="small" color={COLORS.white}/>
              }
                
              </TouchableOpacity>
              
            </View>
          </View>
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
  }
});

export default DetailScreen;
