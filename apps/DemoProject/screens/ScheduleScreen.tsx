import { useFocusEffect, useNavigation } from "@react-navigation/native";
import moment from "moment";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { DefaultScreen } from "../Components";
import { ScheduleItemCard } from "../Components/ScheduleItemCard";
import { styles } from "../styles";
import { trpcClient } from "../utils/trpc";

function ScheduleScreen() {
  const favoritedEvents =
    trpcClient.userRouter.getAllFavoritesForUser.useQuery();
  const navigate = useNavigation();
  const [isShowingFavorites, setIsShowingFavorites] = React.useState(false);
  const [filter, setFilter] = React.useState(null);
  const scheduledEvents = trpcClient.eventRouter.getEvents.useQuery({
    eventType: filter,
  });
  const events = isShowingFavorites
    ? favoritedEvents.data
    : scheduledEvents.data;

  useFocusEffect(
    React.useCallback(() => {
      const load = async () => {
        favoritedEvents.refetch();
        scheduledEvents.refetch();
      };
      return () => load();
    }, [favoritedEvents, scheduledEvents])
  );

  return (
    <DefaultScreen>
      <ScrollView style={{ width: "100%" }}>
        <View
          style={{
            flexDirection: "row",
            display: "flex",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setIsShowingFavorites(!isShowingFavorites);
            }}
          >
            <Text>{isShowingFavorites ? "Show All" : "Show Favorites"}</Text>
          </TouchableOpacity>

          <Dropdown
            style={{
              marginLeft: "auto",
              width: 140,
            }}
            selectedTextStyle={{
              color: "#141d26",
            }}
            placeholderStyle={{
              color: "#141d26",
            }}
            onChange={(value: { value: string }) => {
              if (value.value == "null") {
                setFilter(null);
                scheduledEvents.refetch();
              } else {
                setFilter(value.value);
                scheduledEvents.refetch();
              }
            }}
            value={filter}
            valueField={"value"}
            labelField="label"
            placeholder="Event Type"
            data={[
              {
                label: "None Selected",
                value: "null",
              },
              {
                label: "All",
                value: "all",
              },
              {
                label: "Brothers",
                value: "brothers",
              },
              {
                label: "Competitors",
                value: "competitors",
              },
              {
                label: "Sisters",
                value: "sisters",
              },
            ]}
          />
        </View>

        {events?.map((event, idx) => {
          const englishDay = moment(event.start_date as string).format("dddd");

          const englishDayLastIndex =
            idx > 0
              ? moment(events[idx - 1].start_date as string).format("dddd")
              : null;

          return (
            <View key={idx}>
              {englishDay !== englishDayLastIndex && (
                <Text
                  style={{
                    ...styles.mainFont,
                    marginTop: 20,
                    textAlign: "center",
                  }}
                >
                  {englishDay}
                </Text>
              )}

              <View key={event.id}>
                <ScheduleItemCard event={event} />
              </View>
            </View>
          );
        })}
      </ScrollView>
    </DefaultScreen>
  );
}

export { ScheduleScreen };
