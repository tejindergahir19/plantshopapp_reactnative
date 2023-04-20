import React from "react";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  FlatList,
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";

import COLORS from "../../constant/COLORS";
import BottomNavigation from "../../components/BottomNavigation";
import PLANTDATA from "../../constant/PLANTDATA";
import WishlistCard from "../../components/WishlistCard";

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
        <Text style={styles.headerTitle}>Whishlist</Text>
        <View>
          <TouchableOpacity>
            <Icon
              name="heart-outline"
              color={COLORS.primaryBackgroundColor}
              size={24}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[{ flex: 1, paddingVertical: 20 },styles.iosPadding]}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={PLANTDATA}
          renderItem={({ item }) => (
            <WishlistCard navigation={navigation} value={item} />
          )}
        />
      </View>

      <View style={styles.iosPadding}>
      <BottomNavigation navigation={navigation} screen="wishlist" />
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
});

export default DetailScreen;
