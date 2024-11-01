import { useNavigation } from "@react-navigation/native";
import moment from "moment-timezone";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "../styles";
import { trpcClient } from "../utils/trpc";

export const ScheduleItemCard = ({ event }: { event: any }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const query = trpcClient.eventRouter.getEvent.useQuery({
    id: event.id,
  });
  const navigate = useNavigation();
  const getLetter = (typeOfEvent) => {
    switch (typeOfEvent) {
      case "all":
        return <Text style={{ color: "#ff52b2" }}>A</Text>;
      case "brothers":
        return <Text style={{ color: "#de1b1d" }}>B</Text>;
      case "sisters":
        return <Text style={{ color: "#8b52ff" }}>S</Text>;
      case "competitors":
        return <Text style={{ color: "#5aff5a" }}>C</Text>;
      default:
        return null;
    }
  };

  // From the event.start_date, we can get the time of the event

  var startTime = moment.utc(event.start_date).format("hh:mm A");

  const { data: eventItem, isLoading } =
    trpcClient.eventRouter.getEvent.useQuery({
      id: event.id,
    });

  return (
    <TouchableOpacity
      onPress={() => {
        setIsEnabled(true);
        if (query.isLoading) return;
        navigate.navigate("ScheduleItemScreen", { eventItem: eventItem });
      }}
      style={{
        ...styles.container,
        display: "flex",
        flexDirection: "row",
        borderRadius: 13,
        marginTop: 10,
        marginBottom: 10,
        width: "100%",
      }}
    >
      <View style={{}}>
        <Text
          style={{
            marginRight: 30,
            fontSize: 23,
            fontWeight: "700",
          }}
        >
          {event.name}
        </Text>
        <View style={{ marginTop: 5 }}>
          <Text>
            {startTime} | {event?.location?.nice_name}
          </Text>
        </View>
      </View>
      <Text
        style={{
          marginLeft: "auto",
          marginTop: "auto",
          marginBottom: "auto",
          marginRight: 20,
          fontSize: 23,
          fontWeight: "700",
        }}
      >
        {getLetter(event.type_of_event)}
      </Text>
    </TouchableOpacity>
  );
};
