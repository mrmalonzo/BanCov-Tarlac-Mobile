import React from "react";
import { themeColor, useTheme } from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";

export default (props) => {
  const { isDarkmode } = useTheme();
  return (
    <Ionicons
      name={props.icon}
      style={{ marginBottom: 0 }}
      size={35}
      color={
        props.focused
          ? isDarkmode
            ? themeColor.white100
            : "rgb(0,0,0)"
          :"rgb(105, 161, 175)"
      }
    />
  );
};
