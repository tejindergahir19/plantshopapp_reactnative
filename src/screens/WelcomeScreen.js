import React, { useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Icon from "react-native-vector-icons/MaterialIcons";

import COLORS from "../constant/COLORS";

const image = require("../assets/plant1.png");

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
    Animated.timing(height, {
      toValue: 350,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, []);

  return (
    <SafeAreaView style={[{ flex: 1 }, styles.defaults]}>
      <View style={styles.welcomeImg}>
        <Animated.Image
          source={image}
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
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Home", { name: "Home" });
          }}
          style={styles.nextButton}
        >
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
    backgroundColor: COLORS.primaryBackgroundColor,
    padding: 30,
  },
  welcomeImg: {
    marginTop: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeHeading: {
    marginTop: 50,
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
    marginTop: 60,
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
