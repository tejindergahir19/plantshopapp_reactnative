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

import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const auth = getAuth();

function SignupScreen({ navigation }) {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  const [activityIndicator, setActivityIndicator] = useState(false);

  const [keyboardStatus, setKeyboardStatus] = useState(false);

  const [errorStatus, setErrorStatus] = useState("");

  const handleSignUp = async (email, password) => {
    setActivityIndicator(true);
    try {
      setErrorStatus("");
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // console.log('User account created!');
    } catch (error) {
      // console.log(error.message);
      setErrorStatus(error.message.slice(10,error.message.length));
    }
    setActivityIndicator(false);
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
            onPress={() => handleSignUp(userEmail, userPassword)} 
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
    marginTop: 150,
  },
  emailInput: {
    backgroundColor: COLORS.grey,
    flexDirection: "row",
    alingItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    marginTop: 40,
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
