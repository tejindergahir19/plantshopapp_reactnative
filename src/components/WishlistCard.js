import React from "react";
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Image,
  Platform,
} from "react-native";
import COLORS from "../constant/COLORS";

import Icon from "react-native-vector-icons/Ionicons";

function WishlistCard(props) {
  const { value, navigation } = props;

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("Detail", value);
      }}
      style={styles.itemCard}
    >
      <View style={styles.infoSection}>
        <View style={styles.itemImg}>
          <Image
            source={require("../assets/plant1.png")}
            style={{ width: 65, height: 70 }}
          />
        </View>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text style={styles.title}>
            {value?.title.length > 24
              ? value.title.slice(0, 30) + "..."
              : value.title}
          </Text>

          <View style={styles.footerItem}>
            <Text style={styles.price}>
              {value.price} {value.currency}
            </Text>
          </View>
        </View>
        <View style={styles.addToWishlist}>
          <TouchableOpacity>
            <Icon name="heart" color={COLORS.red} size={24} />
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
