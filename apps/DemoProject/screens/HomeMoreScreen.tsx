import React from "react";
import { Text } from "react-native";
import { DefaultScreen } from "../Components";
import { styles } from "../styles";
import { trpcClient } from "../utils/trpc";
const HomeMoreScreen = ({ route }) => {
  const more = trpcClient.infoRouter.getFullInfo.useQuery();

  return (
    <DefaultScreen>
      <Text style={{ ...styles.baseFont }}>{more?.data?.value}</Text>
    </DefaultScreen>
  );
};

export default HomeMoreScreen;
