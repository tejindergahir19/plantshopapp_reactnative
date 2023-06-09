import React from "react";
import { View,StyleSheet, TouchableOpacity} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";
import COLORS from "../constant/COLORS";

function BottomNavigation(props) {
  const { screen,navigation,refreshAll} = props;
  return (
    <View style={styles.bottomNavigation}>
      <TouchableOpacity
        onPress={() => {
          refreshAll()
            navigation.navigate("Home",{refreshAll:refreshAll});
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
            navigation.navigate("Alarm",{refreshAll:refreshAll});
        }}  style={styles.bottomNavigationButton}>
        <Icon
          style={styles.bottomNavigationIcon}
          name={screen == "alarm" ? "alarm" : "alarm-outline"}
          size={30}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {
            navigation.navigate("Order",{refreshAll:refreshAll});
        }} style={styles.bottomNavigationButton}>
        <Icon
          style={styles.bottomNavigationIcon}
          name={screen == "order" ? "albums" : "albums-outline"}
          size={30}
        />
      </TouchableOpacity>
     
      <TouchableOpacity onPress={() => {
            navigation.navigate("Account",{refreshAll:refreshAll});
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
