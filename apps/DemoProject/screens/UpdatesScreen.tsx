import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { DefaultScreen } from "../Components";
import { styles } from "../styles";
import { trpcClient } from "../utils/trpc";
function UpdatesScreen({ navigation }) {
  const { data: updateData, refetch: refetchUpdateData } =
    trpcClient.notificationRouter.getAllUpdates.useQuery();

  useFocusEffect(() => {
    refetchUpdateData();
  });

  return (
    <DefaultScreen>
      <ScrollView style={{ width: "100%", height: "100%" }}>
        <Text style={{ textAlign: "center", ...styles.mainFont }}>Updates</Text>

        {updateData?.map((update) => {
          return (
            <TouchableOpacity
              key={update.id}
              onPress={() => {
                if (update.event_id) {
                  navigation.navigate("ScheduleItemScreen", {
                    id: update.event_id,
                  });
                }
              }}
            >
              <View
                key={update.id}
                style={{ ...styles.container, marginTop: 20 }}
              >
                <Text style={styles.headerFont}>{update.name}</Text>
                <Text style={styles.cardDescription}>{update.description}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </DefaultScreen>
  );
}

export { UpdatesScreen };
