import React, { useEffect } from "react";
import {
  Text,
  View,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Icon from "react-native-vector-icons/MaterialIcons";

import COLORS from "../constant/COLORS";

const images = require("../assets/plant1.png");

function WelcomeScreen({ navigation }) {
  const width = new Animated.Value(0);
  const height = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(
      width, // The animated value to drive
      {
        toValue: 350, // Animate to opacity: 1 (opaque)
        duration: 600, // Make it take a while
        useNativeDriver: false,
      }
    ).start(); // Starts the animation
    Animated.timing(
      height, // The animated value to drive
      {
        toValue: 350, // Animate to opacity: 1 (opaque)
        duration: 600, // Make it take a while
        useNativeDriver: false,
      }
    ).start(); // Starts the animation
  }, []);

  return (
    <SafeAreaView style={[{ flex: 1 }, styles.defaults]}>
      <View style={styles.welcomeImg}>
        <Animated.Image
          source={images}
          style={{ width: width, height: height }}
        />
        <View style={styles.welcomeHeading}>
          <Text style={styles.welcomeHeadingText}>Enjoy your</Text>
          <Text style={styles.welcomeHeadingText}>
            life with{" "}
            <Text
              style={[
                styles.welcomeHeadingText,
                styles.welcomeHeadingTextHighlighted,
              ]}
            >
              plants
            </Text>
          </Text>
        </View>
      </View>

      <View style={styles.nextButtonView}>
        <TouchableOpacity style={styles.nextButton}>
          <Text style={styles.nextButtonText}>
            <Icon name={"arrow-forward"} size={42} />
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  defaults: {
    backgroundColor: COLORS.secondaryBackgroundColor,
    padding: 30,
    justifyContent: "space-between",
  },
  welcomeImg: {
    marginTop: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeHeading: {
    marginTop: 30,
  },
  welcomeHeadingText: {
    color: COLORS.black,
    fontSize: 40,
    marginTop: 5,
    paddingHorizontal: 10,
  },
  welcomeHeadingTextHighlighted: {
    color: COLORS.primary,
    fontWeight: "bold",
  },
  nextButtonView: {
    justifyContent: "center",
    alignItems: "center",
  },
  nextButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  nextButtonText: {
    color: COLORS.secondaryBackgroundColor,
  },
});

export default WelcomeScreen;
