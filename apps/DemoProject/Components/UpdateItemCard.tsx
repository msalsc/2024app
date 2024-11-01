import { Text, View } from "react-native";

export const updateItemCard = ({ eventId, updateName, updateDescription }) => {
  return (
    <View>
      <Text>{updateName}</Text>
      <Text>{updateDescription}</Text>
    </View>
  );
};
