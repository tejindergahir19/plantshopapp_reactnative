import React, { useState,useEffect} from "react";
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Icon from "react-native-vector-icons/MaterialIcons";

import ItemCard from "../../components/ItemCard";

import COLORS from "../../constant/COLORS";


import HomeScreenItemLoader from "../../loaders/HomeScreenItemLoader";
import HomeScreenCategoryLoader from "../../loaders/HomeScreenCategoryLoader";
import BottomNavigation from "../../components/BottomNavigation";

import {db} from "../../firebase";
import { collection,getDocs } from "firebase/firestore";

function HomeScreen({ navigation }) {
  const [categoryIndex, setCategoryIndex] = useState(0);

  const [isCategoryLoaded, setIsCategoryLoaded] = useState(false);
  const [categoryData, setCategoryData] = useState(null);

  const [isCardsLoaded, setIsCardsLoaded] = useState(false);
  const [plantData,setPlantData] = useState(null);

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

    try{
      const querySnapshot = await getDocs(collection(db,"tbl_plant_data"));
      querySnapshot.forEach((doc) => {
        tmpData.push(doc.data());
      });
    }catch(e){
      console.log("error fetching data");
    }

    setPlantData(tmpData);
    setIsCardsLoaded(true);

    console.log(tmpData)
  }

  useEffect(() => {
    fetchCategoryData();
  },[]);

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
              navigation.navigate("Cart", { name: "Cart" });
            }}
          >
            <Icon name="shopping-cart" size={32} color={COLORS.primary} />
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
              showsVerticalScrollIndicator={false}
              columnWrapperStyle={{
                columnGap: 10,
              }}
              data={plantData}
              renderItem={({ item }) => (
                <ItemCard navigation={navigation} value={item} />
              )}
              keyExtractor={(item) => item.id}
              numColumns={2}
              initialNumToRender={2}
            />
          </View>
        </>
      ) : (
        <View style={{ flex: 1 }}>
          <HomeScreenItemLoader />
        </View>
      )}
      <BottomNavigation navigation={navigation} screen="home" />
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
