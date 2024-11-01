import React from "react";
import { TextInput } from "react-native";

const Input = ({
  onChange,
  placeholder,
  autoCorrect = true,
  style,
  autoCapitalize = "sentences",
  isSecureTextEntry = false,
}: {
  onChange: (value: string) => void;
  placeholder: string;
  autoCorrect?: boolean;
  style: any;
  isSecureTextEntry?: boolean;
  autoCapitalize?: "sentences" | "none" | "words" | "characters" | undefined;
}) => {
  return (
    <TextInput
      autoCorrect={autoCorrect}
      placeholderTextColor="#141d26"
      secureTextEntry={isSecureTextEntry}
      autoCapitalize={autoCapitalize}
      style={{
        ...style,
        width: "100%",
        color: "#141d26",
        backgroundColor: "white",
        borderRadius: 6,
        padding: 15,
      }}
      placeholder={placeholder}
      onChangeText={(e) => {
        onChange(e);
      }}
    />
  );
};

export default Input;
