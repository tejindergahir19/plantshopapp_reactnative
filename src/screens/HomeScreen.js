import React from "react";
import { Text, StyleSheet, View, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Icon from "react-native-vector-icons/MaterialIcons";

import COLORS from "../constant/COLORS";

function HomeScreen() {
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
    borderRadius: 12,
    marginTop: 20,
  },
});

export default HomeScreen;
