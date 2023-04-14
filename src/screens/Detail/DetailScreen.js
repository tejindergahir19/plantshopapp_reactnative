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

const Rating = (props) => {
  const { num } = props;

  let rating = [];

  for (let i = 0; i < num; i++) {
    rating.push(<Icon name="star" color={COLORS.primary} size={20} />);
  }
  for (let i = 0; i < 5 - num; i++) {
    rating.push(<Icon name="star" color={COLORS.grey} size={20} />);
  }

  return <>{rating.map((item) => item)}</>;
};

function DetailScreen({ navigation, route }) {
  const value = route.params;

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
          source={require("../../assets/plant4.png")}
        />
      </View>
      <View style={[styles.itemTitle, styles.iosPadding]}>
        <Text style={styles.itemTitleText}>{value.title}</Text>
        <Text style={styles.review}>
          <Rating num={value.rating} />
        </Text>
      </View>
      <View style={[styles.desc, styles.iosPadding]}>
        <Text style={styles.descText}>
          {value.description.slice(0, 180) + "..."}
        </Text>
      </View>
      <View style={[styles.about, styles.iosPadding]}>
        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>Size</Text>
          <Text style={styles.aboutValue}>{value.size}</Text>
        </View>
        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>Plant</Text>
          <Text style={styles.aboutValue}>{value.plantType}</Text>
        </View>
        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>Height</Text>
          <Text style={styles.aboutValue}>{value.height}"</Text>
        </View>
        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>Humidity</Text>
          <Text style={styles.aboutValue}>{value.humidity}%</Text>
        </View>
      </View>
      <View style={[styles.bottomSection, styles.iosPadding]}>
        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>Price</Text>
          <Text style={styles.priceValue}>{value.price} {value.currency}</Text>
        </View>
        <View style={styles.aboutCard}>
          <TouchableOpacity style={styles.addToCartButton}>
            <Text style={styles.addToCartText}>Add to cart</Text>
          </TouchableOpacity>
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
  itemImage: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
  itemTitle: {
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
  desc: {
    marginTop: 12,
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
    marginTop: 20,
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
  bottomSection:{
    marginTop:30,
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center"
  },
  priceValue:{
    color: COLORS.primary,
    textTransform: "capitalize",
    fontWeight: "bold",
    fontSize: 28,
    marginTop: 3,
  },
  addToCartButton:{
    backgroundColor:COLORS.primary,
    paddingHorizontal:30,
    paddingVertical:15,
    borderRadius:6
  },
  addToCartText:{
    fontWeight:"bold",
    fontSize:18,
    color:COLORS.primaryBackgroundColor
  }
});

export default DetailScreen;
