import React, { useState, useEffect, useRef } from "react";
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Image,
  Platform,
  ActivityIndicator,
} from "react-native";
import COLORS from "../constant/COLORS";
import Icon from "react-native-vector-icons/Ionicons";


function OrderCard(props) {
  const { refreshAll, refreshOrderList, navigation, orderId, orderDetail } =
    props;

    const getStatusBgColor = (status) => {
      switch(status){
        case "delivered":
        case "accepted":
          return COLORS.primary

        case "out for delivery":
          return COLORS.orange;

        case "cancelled":
          return COLORS.red;
          
        default:
          return COLORS.caption
      }
    } 

  return (
    <TouchableOpacity onPress={() => {}} style={styles.itemCard}>
      <View style={styles.orderCardTop}>
      <Icon
                    name="albums"
                    color={COLORS.black}
                    size={16}
                    style={{
                        marginRight:5
                    }}
                  />
        <Text style={styles.orderIdLabel}>OrderID : </Text>
        <Text style={styles.orderId}>{orderId}</Text>
      </View>
      <View style={styles.orderCardBottom}>
        <Text style={styles.orderPrice}>{orderDetail?.subTotal + orderDetail?.delivery } ₹</Text>

        <View style={[styles.statusButton,
        {
          backgroundColor:getStatusBgColor(orderDetail?.status.toLowerCase())
        }]}>
            <Text style={styles.statusText}>{orderDetail?.status}</Text>
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
  orderCardTop:{
    flexDirection:"row"
  },
  orderIdLabel:{
    fontWeight:"bold",
  },
  orderId:{
    color:COLORS.primary,

  },orderCardBottom:{
    flexDirection:"row",
    marginTop:12,
    justifyContent:"space-between",
    alignItems:"center"
  },orderPrice:{
    fontSize:16,
    fontWeight:"bold",
    color:COLORS.primary
  },
  statusButton:{
    borderRadius:6,
    paddingVertical:4,
    paddingHorizontal:12,
  },
  statusText:{
    fontWeight:"bold",
    color:COLORS.white,
    fontSize:12,
    textTransform:"capitalize"
  }
});

export default OrderCard;
