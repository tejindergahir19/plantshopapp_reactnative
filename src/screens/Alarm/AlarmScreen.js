import React, { useState,useRef,useEffect} from "react";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Platform,

  BackHandler
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";

import COLORS from "../../constant/COLORS";
import BottomNavigation from "../../components/BottomNavigation";

import {getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth();

function AlarmScreen({navigation,route}) {

  const refreshAll = route?.params?.refreshAll;

  const userId = useRef(null);

  const isUserLogin = async () => {
    await onAuthStateChanged(auth, (user) => {
      if (user) {
        userId.current = user.uid;
        // fetchWishlist();
      } else {
        navigation.navigate("Login", { name: "Login" });
      }
    });
  };

  useEffect(() => {
    isUserLogin();

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      ()=>{
        refreshAll();
      }
    );

    return () => backHandler.remove();
  }, []);

  return (
    <SafeAreaView style={[{ flex: 1 }, styles.defaults]}>
      <View style={[styles.header, styles.iosPadding]}>
        <TouchableOpacity
          onPress={() => {
            refreshAll();
            navigation.goBack();
          }}
        >
          <Icon name="arrow-back" size={32} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Water Alert</Text>
        <View>
          <TouchableOpacity>
            <Icon
              name="log-out-outline"
              color={COLORS.white}
              size={24}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[{ flex: 1, paddingVertical: 20 }, styles.iosPadding]}>
        <TouchableOpacity style={styles.accountTabs}>
          <View style={styles.accountInnerTabs}>
          <Icon
              name="person"
              color={COLORS.black}
              size={24}
            />

            <Text style={styles.accountInnerTabsText}>Profile</Text>
          </View>
          <Icon
              name="caret-forward"
              color={COLORS.black}
              size={24}
            />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
            navigation.navigate("Wishlist",{refreshAll:refreshAll});
        }} style={styles.accountTabs}>
          <View style={styles.accountInnerTabs}>
          <Icon
              name="heart"
              color={COLORS.black}
              size={24}
            />

            <Text style={styles.accountInnerTabsText}>Wishlist</Text>
          </View>
          <Icon
              name="caret-forward"
              color={COLORS.black}
              size={24}
            />
        </TouchableOpacity>
        <TouchableOpacity style={styles.accountTabs}>
          <View style={styles.accountInnerTabs}>
          <Icon
              name="logo-dropbox"
              color={COLORS.black}
              size={24}
            />

            <Text style={styles.accountInnerTabsText}>Orders</Text>
          </View>
          <Icon
              name="caret-forward"
              color={COLORS.black}
              size={24}
            />
        </TouchableOpacity>
        
        
        <TouchableOpacity style={styles.accountTabs}>
          <View style={styles.accountInnerTabs}>
          <Icon
              name="chatbubble-ellipses"
              color={COLORS.black}
              size={24}
            />

            <Text style={styles.accountInnerTabsText}>Chat with us !</Text>
          </View>
          <Icon
              name="caret-forward"
              color={COLORS.black}
              size={24}
            />
        </TouchableOpacity>
      </View>

      <View style={styles.iosPadding}>
        <BottomNavigation navigation={navigation} refreshAll={refreshAll}  screen="alarm" />
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
  accountTabs:{
    backgroundColor:COLORS.grey,
    borderRadius:6,
    justifyContent:"space-between",
    flexDirection:"row",
    alignItems:"center",
    padding:15,
    marginBottom:6
  },
  accountInnerTabs:{
    justifyContent:"space-between",
    flexDirection:"row",
    alignItems:"center"
  },
  accountInnerTabsText:{
    marginLeft:10,
    fontWeight:"bold",
    fontSize:16
  }
});

export default AlarmScreen;
