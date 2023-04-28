import React,{useState,useEffect,useRef} from "react";
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Image,
  Platform,
} from "react-native";
import COLORS from "../constant/COLORS";

import Icon from "react-native-vector-icons/Ionicons";

import { db } from "../firebase";
import {
  doc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  collection,
  deleteDoc,
} from "firebase/firestore";

import { getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth();

function CartItemCard(props) {
  const userId = useRef(null);
  const { plantId,quantity, navigation } = props;

  const [plantQuantity,setPlantQuantity] = useState(quantity);

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
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("Detail", value);
      }}
      style={styles.itemCard}
    >
      <View style={styles.infoSection}>
        <View style={styles.itemImg}>
          <Image
            source={require("../assets/plant1.png")}
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
          <TouchableOpacity>
            <Icon name="close" color={COLORS.red} size={20} />
          </TouchableOpacity>

          <View style={styles.quantityMeasure}>
            <TouchableOpacity onPress={
              ()=>{
                setPlantQuantity(plantQuantity - 1);
              }
            } style={styles.sub}>
              <Text style={styles.subText}>-</Text>
            </TouchableOpacity>

            <Text style={styles.quantity}>{(plantQuantity < 10) && 0}{plantQuantity}</Text>

            <TouchableOpacity onPress={
              ()=>{
                setPlantQuantity(plantQuantity + 1);
              }
            } style={styles.add}>
              <Text style={styles.addText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
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
    justifyContent: "space-between",
    alignItems: "flex-end",
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
  },
  quantityMeasure:{
    flexDirection:"row",
  },
  sub:{
    backgroundColor:COLORS.primary,
    borderRadius:50,
    marginRight:12,
    justifyContent:"center",
    alignItems:"center",
    width:26,
    height:26
  },
  subText:{
    color:COLORS.white,
    fontSize:18,
  },
  add:{
    backgroundColor:COLORS.primary,
    borderRadius:50,
    marginLeft:12,
    justifyContent:"center",
    alignItems:"center",
    width:26,
    height:26
  },
  addText:{
    color:COLORS.white,
    fontSize:16,
  }
});

export default CartItemCard;
