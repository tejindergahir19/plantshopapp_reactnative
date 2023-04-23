import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "react-native";

import WelcomeScreen from "./src/screens/WelcomeScreen";
import HomeScreen from "./src/screens/Home/HomeScreen";

import COLORS from "./src/constant/COLORS";
import WhishlistScreen from "./src/screens/Whishlist/Whishlist";
import AlarmScreen from "./src/screens/Alarm/AlarmScreen";
import AccountScreen from "./src/screens/Account/AccountScreen";
import CartScreen from "./src/screens/Cart/CartScreen";
import DetailScreen from "./src/screens/Detail/DetailScreen";

import { app, db } from "./src/firebase";
import { collection, doc, getDocs } from "firebase/firestore";
import LoginScreen from "./src/screens/Auth/LoginScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  // const addCategories = async () => {
  //   try {
  //     const docRef = await addDoc(collection(db, "tbl_categories"),
  //       {
  //         category:"b"
  //       });

  //     console.log("Document written withID : ", docRef.id);
  //   } catch (e) {
  //     console.log("Error adding document: ", e);
  //   }
  // };

  // const getCategories = async () => {
  //   try {
  //     const querySnapshot = await getDocs(collection(db,"tbl_categories"));

  //     querySnapshot.forEach((doc) => {
  //       console.log(doc.id,doc.data().category);
  //     })
  //   } catch (e) {
  //     console.log("error fetching data",e);
  //   }
  // };

  // React.useEffect(()=>{
  //   getCategories();
  // })

  return (
    <NavigationContainer>
      <StatusBar animated={true} backgroundColor={COLORS.primary} />
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "Login", headerShown: false }}
        />
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ title: "Welcome", headerShown: false }}
        />

        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Home", headerShown: false }}
        />

        <Stack.Screen
          name="Whishlist"
          component={WhishlistScreen}
          options={{ title: "Whislist", headerShown: false }}
        />
        <Stack.Screen
          name="Alarm"
          component={AlarmScreen}
          options={{ title: "Alarm", headerShown: false }}
        />
        <Stack.Screen
          name="Account"
          component={AccountScreen}
          options={{ title: "Account", headerShown: false }}
        />
        <Stack.Screen
          name="Cart"
          component={CartScreen}
          options={{ title: "Cart", headerShown: false }}
        />
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={{ title: "Detail", headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
