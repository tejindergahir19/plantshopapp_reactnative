import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from "react-native";
import COLORS from "../../constant/COLORS";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

function LoginScreen({ navigation }) {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: COLORS.primaryBackgroundColor }}
    >
      <View style={styles.defaults}>
        <Text style={styles.login}>Login</Text>

        <View style={styles.emailInput}>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Icon name="email" size={28} color={COLORS.primary} />
          </View>
          <View>
            <TextInput style={{ height: 40, width: 270 }} placeholder="Email" />
          </View>
        </View>
        <View style={styles.pswInput}>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Icon name="key" size={28} color={COLORS.primary} />
          </View>
          <View>
            <TextInput
              style={{ height: 40, width: 270 }}
              placeholder="Password"
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Home", { name: "Home" });
          }}
          style={styles.loginButton}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.forgotButton}>
          <Text style={styles.forgotButtonText}>Forgot Password</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.newUserButton}>
          <Text style={styles.newUserHelpText}>Not a member?</Text>
          <TouchableOpacity>
            <Text style={styles.newUserButtonText}>Signup now</Text>
          </TouchableOpacity>
        </View>
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
  },newUserHelpText:{
    marginRight:5,
    color:COLORS.caption,
    fontSize:16
  },
  newUserButtonText:{
    color:COLORS.primary,
    fontSize:16,
  }
});

export default LoginScreen;
