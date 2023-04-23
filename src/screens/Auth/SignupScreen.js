import React, { useState, useEffect } from "react";
import {
  Keyboard,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import COLORS from "../../constant/COLORS";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { db } from "../../firebase";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";

const validateEmail = (email) => {
  let emailRegEx = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

  return emailRegEx.test(email);
};

const validatePhone = (phone) => {
  let phoneRegEx = /[0-9]{4}/;

  return phoneRegEx.test(phone);
};

function SignupScreen({ navigation }) {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userPassword, setUserPassword] = useState("");

  const [activityIndicator, setActivityIndicator] = useState(false);

  const [keyboardStatus, setKeyboardStatus] = useState(false);

  const [errorStatus, setErrorStatus] = useState("");

  const addUser = async () => {
    try {
      setActivityIndicator(true);
      const fields = [userName, userEmail, userPassword, userPhone];
  
      if (fields.every((field) => field)) {
        const [emailIsValid, phoneIsValid] = await Promise.all([
          validateEmail(userEmail),
          validatePhone(userPhone),
        ]);
  
        if (emailIsValid && phoneIsValid) {
          const docId = [];
  
          const q = query(
            collection(db, "tbl_customer"),
            where("email", "==", userEmail),
            where("phone", "==", userPhone)
          );
          const querySnapshot = await getDocs(q);
  
          querySnapshot.forEach((doc) => {
            docId.push(doc.id);
          });
  
          if (docId.length === 0) {
            const docRef = await addDoc(collection(db, "tbl_customer"), {
              name: userName,
              email: userEmail,
              password: userPassword,
              phone: userPhone,
              address: [],
            });
            console.log("Document written with ID: ", docRef.id);
            navigation.navigate("Home", { name: "Home" });
          } else {
            setErrorStatus("User Already Exists!");
          }
        } else {
          setErrorStatus(emailIsValid ? "Invalid Phone!" : "Invalid Email!");
        }
      } else {
        setErrorStatus("All Fields Required!");
      }
    } catch (error) {
      console.log("Error adding document: ", error);
      setErrorStatus("Something Went Wrong!");
    } finally {
      setActivityIndicator(false);
    }
  };
  

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardStatus(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardStatus(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: COLORS.primaryBackgroundColor }}
    >
      <View style={styles.defaults}>
        <Text style={styles.login}>Signup</Text>
        <View style={styles.nameInput}>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Icon name="account" size={28} color={COLORS.primary} />
          </View>
          <View>
            <TextInput
              onChangeText={setUserName}
              style={{ height: 40, width: 270 }}
              placeholder="Name"
            />
          </View>
        </View>

        <View style={styles.emailInput}>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Icon name="email" size={28} color={COLORS.primary} />
          </View>
          <View>
            <TextInput
              onChangeText={setUserEmail}
              style={{ height: 40, width: 270 }}
              placeholder="Email"
            />
          </View>
        </View>

        <View style={styles.phoneInput}>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Icon name="phone" size={28} color={COLORS.primary} />
          </View>
          <View>
            <TextInput
              onChangeText={setUserPhone}
              style={{ height: 40, width: 270 }}
              placeholder="Phone"
            />
          </View>
        </View>

        <View style={styles.pswInput}>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Icon name="key" size={28} color={COLORS.primary} />
          </View>
          <View>
            <TextInput
              onChangeText={setUserPassword}
              style={{ height: 40, width: 270 }}
              placeholder="Password"
            />
          </View>
        </View>

        {errorStatus && (
          <Text
            style={{ color: COLORS.red, textAlign: "center", marginTop: 20 }}
          >
            {errorStatus}
          </Text>
        )}

        {activityIndicator ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => {
              addUser();
            }}
            style={styles.loginButton}
          >
            <Text style={styles.loginButtonText}>Signup</Text>
          </TouchableOpacity>
        )}
      </View>

      {!keyboardStatus && (
        <View style={styles.newUserButton}>
          <Text style={styles.newUserHelpText}>Already a member?</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Login", { name: "Login" });
            }}
          >
            <Text style={styles.newUserButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  defaults: {
    backgroundColor: COLORS.primaryBackgroundColor,
    padding: 30,
    flex: 1,
  },
  login: {
    fontSize: 40,
    fontWeight: "bold",
    color: COLORS.primary,
    marginTop: 140,
  },
  nameInput: {
    backgroundColor: COLORS.grey,
    flexDirection: "row",
    alingItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    marginTop: 40,
  },
  emailInput: {
    backgroundColor: COLORS.grey,
    flexDirection: "row",
    alingItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    marginTop: 10,
  },
  phoneInput: {
    backgroundColor: COLORS.grey,
    flexDirection: "row",
    alingItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    marginTop: 10,
  },
  pswInput: {
    backgroundColor: COLORS.grey,
    flexDirection: "row",
    alingItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    marginTop: 10,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 6,
    marginTop: 30,
  },
  loginButtonText: {
    fontWeight: "bold",
    fontSize: 18,
    color: COLORS.primaryBackgroundColor,
    textTransform: "capitalize",
  },
  forgotButton: {
    backgroundColor: COLORS.primaryBackgroundColor,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 6,
    marginTop: 10,
  },
  forgotButtonText: {
    fontSize: 16,
    color: COLORS.caption,
    textTransform: "capitalize",
  },
  newUserButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
  },
  newUserHelpText: {
    marginRight: 5,
    color: COLORS.caption,
    fontSize: 16,
  },
  newUserButtonText: {
    color: COLORS.primary,
    fontSize: 16,
  },
  loader: {
    marginTop: 30,
  },
});

export default SignupScreen;
