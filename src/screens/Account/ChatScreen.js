import React, {useRef,useEffect,useState} from "react";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Platform,
TextInput,
  BackHandler,
  ActivityIndicator,
  Alert,
  Vibration
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";

import COLORS from "../../constant/COLORS";

import {getAuth, onAuthStateChanged } from "firebase/auth";

import { db } from "../../firebase";
import {
  collection,
  addDoc
} from "firebase/firestore";

const auth = getAuth();

function ChatScreen({navigation,route}) {

  const refreshAll = route?.params?.refreshAll;

  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [subject, setSubject] = useState(null);
  const [message, setMessage] = useState(null);

  const [errorText, setErrorText] = useState(null);

  const userId = useRef(null);

  const isUserLogin = async () => {
    await onAuthStateChanged(auth, (user) => {
      if (user) {
        userId.current = user.uid;

        setEmail(user?.email);
      
      } else {
        navigation.navigate("Login", { name: "Login" });
      }
    });
  };

  const submitRequest = async () => {
    setErrorText(null);
    (name != null &&
        subject != null  &&
        message != null) ? 
        (await addDoc(collection(db, "tbl_contact"), {
          userId: userId.current,
          name: name,
          email: email,
          subject: subject,
          message:message
        })) : setErrorText("All fields are required !")

        Alert.alert("Request Submitted !");
        Vibration.vibrate();
    
        navigation.navigate("Account", { refreshAll: refreshAll });
  }

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
        <Text style={styles.headerTitle}>Chat with us !</Text>
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
      <View style={styles.form}>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={(newText) => {
                setName(newText);
              }}
            />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              editable={false}
            />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Subject</Text>
            <TextInput
              style={styles.input}
              value={subject}
              onChangeText={(newText) => {
                setSubject(newText);
              }}
            />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Message</Text>
            <TextInput
              style={[styles.input]}
              value={message} 
              onChangeText={(newText) => {
                setMessage(newText);
              }}
            />
          </View>
          {true && (
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
                    backgroundColor: COLORS.primary,
                    borderRadius: 6,
                    padding: 12,
                    marginTop: 10,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={()=>{
                    submitRequest();
                  }}
                >
                  {false ? (
                    <ActivityIndicator size="small" color={COLORS.white}  />
                  ) : (
                    <Text
                      style={{
                        color: COLORS.white,
                        fontWeight: "bold",
                        fontSize: 16,
                      }}
                    >
                      Submit Request
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>   
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
  }
});

export default ChatScreen;
