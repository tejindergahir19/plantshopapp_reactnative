import React, { useState } from "react";
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

import ItemCard from "../components/ItemCard";

import COLORS from "../constant/COLORS";
import CATEGORIES from "../constant/CATEGORIES";
import PLANTDATA from "../constant/PLANTDATA";

function HomeScreen() {
  const [categoryIndex, setCategoryIndex] = useState(0);

  return (
    <SafeAreaView style={[{ flex: 1 }, styles.defaults]}>
      <View style={styles.header}>
        <Text style={styles.subHeading}>Welcome to</Text>
        <Text style={styles.Heading}>Plant Shop</Text>
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
      <View style={styles.categories}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {CATEGORIES.map((item, index) => (
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
      <View style={{ flex: 1, paddingVertical: 20 }}>
        <FlatList
        showsVerticalScrollIndicator={false}
          columnWrapperStyle={{
            columnGap: 10,
          }}
          data={PLANTDATA}
          renderItem={({ item }) => <ItemCard value={item} />}
          keyExtractor={(item) => item.id}
          
          numColumns={2}

          initialNumToRender={2}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  defaults: {
    backgroundColor: COLORS.primaryBackgroundColor,
    padding: 20,
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
