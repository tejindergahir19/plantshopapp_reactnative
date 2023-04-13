import React from "react";
import { Text, Button, View, Pressable, StyleSheet,TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Icon from "react-native-vector-icons/MaterialIcons";

import COLORS from "../constant/COLORS";

const images = [
    require('../assets/plant1.png'),
    require('../assets/plant4.png'),
  ]

function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={[{ flex: 1 }, styles.defaults]}>
      <View>
        <TouchableOpacity>
            <Text><Icon name="cart" color={COLORS.caption} size={20} /></Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  defaults: {
    backgroundColor: COLORS.secondaryBackgroundColor,
    justifyContent:"space-between"
  }
});

export default WelcomeScreen;
