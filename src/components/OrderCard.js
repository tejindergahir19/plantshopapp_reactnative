import React from "react";
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
} from "react-native";
import COLORS from "../constant/COLORS";

function OrderCard(props) {
  const { refreshAll, navigation, orderId, orderDetail } = props;

  const getStatusBgColor = (status) => {
    switch (status) {
      case "delivered":
      case "accepted":
        return COLORS.primary;

      case "out for delivery":
        return COLORS.orange;

      case "cancelled":
        return COLORS.red;

      default:
        return COLORS.caption;
    }
  };

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("OrderDetail", {
          orderId: orderId,
          orderDetail: orderDetail,
          refreshAll: refreshAll,
        });
      }}
      style={styles.itemCard}
    >
      <View style={styles.orderCardTop}>
        <Text style={styles.orderIdLabel}>OrderID : </Text>
        <Text style={styles.orderId}>{orderId}</Text>
      </View>
      <Text style={{
        marginTop:3,
        color:COLORS.caption
      }}>{orderDetail.date} | {orderDetail.time}</Text>
      <View style={styles.orderCardBottom}>
       <View style={{
        flexDirection:"row"
       }}>
       <Text style={styles.orderPrice}>
          {orderDetail?.subTotal + orderDetail?.delivery} ₹
        </Text>
       </View>

        <View
          style={[
            styles.statusButton,
            {
              backgroundColor: getStatusBgColor(
                orderDetail?.status.toLowerCase()
              ),
            },
          ]}
        >
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
  orderCardTop: {
    flexDirection: "row",
  },
  orderIdLabel: {
    fontWeight: "bold",
  },
  orderId: {
    color: COLORS.primary,
  },
  orderCardBottom: {
    flexDirection: "row",
    marginTop: 8,
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  statusButton: {
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  statusText: {
    fontWeight: "bold",
    color: COLORS.white,
    fontSize: 12,
    textTransform: "capitalize",
  },
});

export default OrderCard;
