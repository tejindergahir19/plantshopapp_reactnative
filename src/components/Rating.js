import React from "react";

import Icon from "react-native-vector-icons/Ionicons";
import COLORS from "../constant/COLORS";

function Rating(props){
    const { num } = props;
  
    let rating = [];
  
    for (let i = 0; i < num; i++) {
      rating.push(<Icon name="star" color={COLORS.primary} size={20} />);
    }
    for (let i = 0; i < 5 - num; i++) {
      rating.push(<Icon name="star" color={COLORS.grey} size={20} />);
    }
  
    return <>{rating.map((item) => item)}</>;
};

export default Rating;