import React, { useState, useRef, useEffect } from "react";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  BackHandler,
  ScrollView,
  TextInput,
  Switch,
  Button,
  Alert,
  Vibration,
  ActivityIndicator,
} from "react-native";

import { db } from "../../../firebase";
import {
  getDocs,
  query,
  where,
  collection,
  updateDoc,
  doc
} from "firebase/firestore";

import Icon from "react-native-vector-icons/Ionicons";

import COLORS from "../../../constant/COLORS";

import { getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth();

function ProfileScreen({ navigation, route }) {
  const refreshAll = route?.params?.refreshAll;

  const userId = useRef(null);

  const [isUserDataExists, setIsUserDataExists] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const [updatingLoader, setUpdatingLoader] = useState(false);

  //form data
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [phone, setPhone] = useState(null);
  const [address, setAddress] = useState(null);

  const [errorText, setErrorText] = useState(null);

  const isUserLogin = async () => {
    await onAuthStateChanged(auth, (user) => {
      if (user) {
        userId.current = user.uid;

        setEmail(user?.email);

        checkUserDataExists();
      } else {
        navigation.navigate("Login", { name: "Login" });
      }
    });
  };

  const checkUserDataExists = async () => {
    try {
      const q = query(
        collection(db, "tbl_user"),
        where("userId", "==", userId.current)
      );
      const querySnapshot = await getDocs(q);

      setIsUserDataExists(querySnapshot.docs.length > 0);
      setIsEnabled(!(querySnapshot.docs.length > 0));

      if (querySnapshot.docs.length > 0) {
        setName(querySnapshot.docs[0].data().userName);
        setPhone(querySnapshot.docs[0].data().userPhone);
        setAddress(querySnapshot.docs[0].data().userAddress);
      }
    } catch (error) {
      console.error("Error checking user: ", error);
    }
  };

  const UpdateProfileData = async () => {
    setUpdatingLoader(true);
    setErrorText(null);

    !(name != null && phone != null && address != null) &&
      setErrorText("All fields are required !");

    if (isUserDataExists) {
      
      const q = query(
        collection(db, "tbl_user"),
        where("userId", "==", userId.current)
      );
      const querySnapshot = await getDocs(q);

      let docRef = doc(db, "tbl_user", querySnapshot?.docs[0]?.id);

      try {
        name != null &&
        phone != null &&
        address != null && 
        (
          await updateDoc(docRef, {
            userName: name,
            userPhone: phone,
            userAddress: address,
          })
        )
        
      } catch (error) {
        console.log("Not able to update", error);
      }
    } else {
      name != null &&
        phone != null &&
        address != null &&
        (await addDoc(collection(db, "tbl_user"), {
          userId: userId.current,
          userName: name,
          userPhone: phone,
          userAddress: address,
        }));
    }

    setUpdatingLoader(false);

    Alert.alert("Profile Updated !");
    Vibration.vibrate();

    navigation.navigate("Account", { refreshAll: refreshAll });
  };

  useEffect(() => {
    isUserLogin();

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
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
        <Text style={styles.headerTitle}>Profile</Text>
        <View>
          <TouchableOpacity>
            <Icon
              name="log-out-outline"
              color={COLORS.primaryBackgroundColor}
              size={24}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.toggleContainer}>
        <Text style={{ marginRight: 5 }}>Edit Mode</Text>
        <Switch
          trackColor={{ false: COLORS.red, true: COLORS.primary }}
          thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>

      <ScrollView style={[{ flex: 1, paddingVertical: 20 }, styles.iosPadding]}>
        <View style={styles.form}>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder={name ?? "Enter your name"}
              editable={isEnabled}
              onChangeText={(newText) => {
                setName(newText);
              }}
            />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder={email ?? "Enter your email"}
              editable={false}
            />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Mobile</Text>
            <TextInput
              style={styles.input}
              placeholder={phone ?? "Enter your mobile"}
              editable={isEnabled}
              onChangeText={(newText) => {
                setPhone(newText);
              }}
            />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={styles.input}
              placeholder={address ?? "Enter your address"}
              editable={isEnabled}
              onChangeText={(newText) => {
                setAddress(newText);
              }}
            />
          </View>
          {isEnabled && (
            <>
              {errorText && (
                <Text
                  style={{
                    color: COLORS.red,
                    margin: 10,
                    textAlign: "center",
                  }}
                >
                  {errorText}
                </Text>
              )}
              <View>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: COLORS.primary,
                    borderRadius: 6,
                    padding: 12,
                    marginTop: 10,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => {
                    UpdateProfileData();
                  }}
                >
                  {updatingLoader ? (
                    <ActivityIndicator />
                  ) : (
                    <Text
                      style={{
                        color: COLORS.white,
                        fontWeight: "bold",
                        fontSize: 16,
                      }}
                    >
                      Update
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </ScrollView>
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
  accountTabs: {
    backgroundColor: COLORS.grey,
    borderRadius: 6,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginBottom: 6,
  },
  accountInnerTabs: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  accountInnerTabsText: {
    marginLeft: 10,
    fontWeight: "bold",
    fontSize: 16,
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    width: 343,
    height: 42,
    padding: 12,
    // paddingLeft:0,
    marginBottom: 15,
    color: COLORS.caption,
    borderWidth: 1,
    borderColor: COLORS.grey,
    borderRadius: 6,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 10,
  },
});

export default ProfileScreen;
