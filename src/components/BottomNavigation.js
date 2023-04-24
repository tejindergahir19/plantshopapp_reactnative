import React from "react";
import { View,StyleSheet, TouchableOpacity} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";
import COLORS from "../constant/COLORS";

function BottomNavigation(props) {
  const { screen,navigation} = props;
  return (
    <View style={styles.bottomNavigation}>
      <TouchableOpacity
        onPress={() => {
            navigation.navigate("Home", { name: "Home" });
        }}
        style={styles.bottomNavigationButton}
      >
        <Icon
          style={styles.bottomNavigationIcon}
          name={screen == "home" ? "home" : "home-outline"}
          size={28}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {
            navigation.navigate("Wishlist", { name: "Wishlist" });
        }} style={styles.bottomNavigationButton}>
        <Icon
          style={styles.bottomNavigationIcon}
          name={screen == "wishlist" ? "heart" : "heart-outline"}
          size={30}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {
            navigation.navigate("Alarm", { name: "Alarm" });
        }}  style={styles.bottomNavigationButton}>
        <Icon
          style={styles.bottomNavigationIcon}
          name={screen == "alarm" ? "alarm" : "alarm-outline"}
          size={30}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {
            navigation.navigate("Account", { name: "Account" });
        }}  style={styles.bottomNavigationButton}>
        <Icon
          style={styles.bottomNavigationIcon}
          name={screen == "account" ? "person-circle" : "person-circle-outline"}
          size={30}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNavigation: {
    justifyContent: "space-between",
    flexDirection: "row",
    padding: 5
  },
  bottomNavigationIcon: {
    color: COLORS.primary,
  },
});

export default BottomNavigation;
