import React from "react";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";

import COLORS from "../../constant/COLORS";

function DetailScreen({ navigation, route }) {
  const value = route.params;

  return (
    <SafeAreaView style={[{ flex: 1 }, styles.defaults]}>
      <View style={styles.header}>
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
            <Icon name="heart-outline" color={COLORS.red} size={30} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.itemImage}>
        <Image
          style={{
            width: 350,
            height: 350,
          }}
          source={require("../../assets/plant1.png")}
        />
      </View>
      <View style={styles.itemTitle}>
        <Text style={styles.itemTitleText}>{value.title}</Text>
        <Text style={styles.review}>
          <Icon name="star" color={COLORS.primary} size={20} />
          <Icon name="star" color={COLORS.primary} size={20} />
          <Icon name="star" color={COLORS.primary} size={20} />
          <Icon name="star" color={COLORS.grey} size={20} />
          <Icon name="star" color={COLORS.grey} size={20} />
        </Text>
      </View>
      <View style={styles.desc}>
        <Text style={styles.descText}>{value.description.slice(0,180) + "..."}</Text>
      </View>
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
    paddingHorizontal: Platform.OS === "ios" ? 20 : 0,
  },
  headerTitle: {
    color: COLORS.primary,
    fontWeight: "bold",
    fontSize: 20,
  },
  itemImage: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
  itemTitle: {
    paddingHorizontal: Platform.OS === "ios" ? 20 : 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 30,
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
  desc:{
    paddingHorizontal: Platform.OS === "ios" ? 20 : 0,
    marginTop:12,
  },
  descText:{
    fontSize:16,
    textAlign:Platform.OS === "ios" ? "justify" : "auto",
    color:COLORS.caption
  }
});

export default DetailScreen;
