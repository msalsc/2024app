import React from "react";
import { Image, Text } from "react-native";
import { DefaultScreen } from "../Components";
import { styles } from "../styles";
const SponsorInfoScreen = ({ route }) => {
  const info = route.params.item;
  return (
    <DefaultScreen>
      <Image source={{ uri: info.logo }} />
      <Text style={{ ...styles.mainFont }}>{info.name}</Text>
      <Text style={{ ...styles.baseFont }}>{info.description}</Text>

      {info.link && (
        <Text style={{ ...styles.baseFont }}>
          Website:{" "}
          <Text style={{ color: "blue" }} onPress={() => { }}>
            {info.link}
          </Text>
        </Text>
      )}
    </DefaultScreen>
  );
};

export default SponsorInfoScreen;
