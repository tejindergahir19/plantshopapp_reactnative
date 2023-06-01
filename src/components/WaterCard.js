import React, { useState, useEffect, useRef } from "react";
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Image,
  Platform,
} from "react-native";
import COLORS from "../constant/COLORS";

import { db } from "../firebase";
import {
  doc,
  getDoc,
} from "firebase/firestore";

import { getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth();

function WaterCard(props) {
  const userId = useRef(null);
  const {
    plantId,
    navigation,
    refreshAll,
  } = props;

  const [value, setValue] = useState(null);


  const isUserLogin = async () => {
    await onAuthStateChanged(auth, (user) => {
      if (user) {
        userId.current = user.uid;
        fetchPlantData();
      } else {
        navigation.navigate("Login", { name: "Login" });
      }
    });
  };

  const fetchPlantData = async () => {
    let querySnapshot;
    try {
      querySnapshot = await getDoc(doc(db, "tbl_plant_data", plantId));
    } catch (error) {
      console.error("Error fetching data: ", error);
      return;
    }
    setValue(querySnapshot.data());
  };

  useEffect(() => {
    isUserLogin();
  }, []);

  return (
    (value?.plantType != "gardening tools" && value?.plantType != "pots" && value?.plantType != "seeds" && value?.plantType != "other") ? 
    (
        <TouchableOpacity
      onPress={() => {
        navigation.navigate("Detail", {
          plantId: plantId,
          refreshAll: refreshAll,
        });
      }}
      style={styles.itemCard}
    >
      <View style={styles.infoSection}>
        <View style={styles.itemImg}>
          <Image
            source={{
            uri: value?.img,
          }}
            style={{ width: 65, height: 70 }}
          />
        </View>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text style={styles.title}>
            {value?.title.length > 24
              ? value?.title.slice(0, 30) + "..."
              : value?.title}
          </Text>

          <View style={styles.footerItem}>
            <Text style={styles.price}>
              {value?.price} {value?.currency}
            </Text>
          </View>
        </View>
        <View style={styles.addToWishlist}>
          <Text>Water Every</Text>
          <Text style={{
            color:COLORS.primary,
            fontSize:20,
            fontWeight:"bold"
          }}>{
                Number(value?.waterEvery) > 24 ? 
            ((value?.waterEvery / 24) + " Days") : (value?.waterEvery+" Hr")
            }</Text>
        </View>
      </View>
    </TouchableOpacity>
    ) : null
  );
}

const styles = StyleSheet.create({
  itemCard: {
    flex: 1,
    backgroundColor: COLORS.grey,
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
    flexDirection: "column",
  },
  stockLeftView: {
    flexDirection: "row-reverse",
    justifyContent: "center",
  },
  stockLeft: {
    color: COLORS.red,
    fontSize: Platform.OS == "ios" ? 11 : 10,
    fontWeight: "bold",
  },
  addToWishlist: {
    justifyContent: "center",
    alignItems: "center",
  },
  infoSection: {
    flexDirection: "row",
  },
  itemImg: {
    justifyContent: "center",
    alignItems: "flex-start",
    marginRight: 6,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    textTransform: "capitalize",
    color: COLORS.black,
  },
  footerItem: {
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: "bold",
  }
});

export default WaterCard;
