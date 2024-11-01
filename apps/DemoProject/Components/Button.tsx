import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "../styles";

const Button = ({
  text,
  style,
  color,
  disabled = false,
  children,
  fontColor = "black",
  onPress,
}: {
  text: String;
  children: any;
  onPress: any;
  disabled: boolean;
  fontColor?: string;
  color?: string;
  style: any;
}) => {
  return (
    <TouchableOpacity
      style={{ width: "100%" }}
      onPress={() => {
        if (disabled) return;
        onPress();
      }}
    >
      <View
        style={{
          ...style,
          width: "100%",
          padding: 20,
          backgroundColor: disabled ? "#c9c9cb" : color,
          borderRadius: 6,
        }}
      >
        <Text
          style={{
            color: fontColor,
            ...styles.buttonFont,
            fontSize: 23,
            textAlign: "center",
          }}
        >
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default Button;
