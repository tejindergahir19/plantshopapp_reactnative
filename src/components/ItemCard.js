import React from "react";
import { TouchableOpacity, Text, View, StyleSheet, Image } from "react-native";
import COLORS from "../constant/COLORS";

import Icon from "react-native-vector-icons/Ionicons";

function ItemCard(props) {
  const { value,navigation} = props;

  return (
    <TouchableOpacity onPress={() => {
      navigation.navigate("Detail",value);
  }}  style={styles.itemCard}>
        <View style={styles.addToWishlist}>
          <TouchableOpacity>
            <Icon name="heart-outline" color={COLORS.red} size={24} />
          </TouchableOpacity>
        </View>
        <View style={styles.itemImg}>
          <Image
            source={require("../assets/plant1.png")}
            style={{ width: 130, height: 130 }}
          />
        </View>

        <Text style={styles.title}>
          {value?.title.length > 24
            ? value.title.slice(0, 24) + "..."
            : value.title}
        </Text>
        <View style={styles.footerItem}>
            <Text style={styles.price}>{value.price} {value.currency}</Text>
            
            <View style={styles.cartButton}>
                <TouchableOpacity>
                    <Text>
                       <Icon name="cart-outline" size={24}/>
                    </Text>
                </TouchableOpacity>
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
    marginBottom:10
  },
  addToWishlist: {
    alignItems: "flex-end",
  },
  itemImg: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    textTransform: "capitalize",
    marginTop:20
  },
  footerItem:{
    marginTop:12,
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center"
  },
  price:{
    color:COLORS.primary,
    fontSize:18,
    fontWeight:"bold"
  }
});

export default ItemCard;