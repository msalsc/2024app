import React from "react";
import { StyleSheet, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import openMap from "react-native-open-maps";
import { Button, DefaultScreen } from "../Components";
import { ScheduleItemCard } from "../Components/ScheduleItemCard";
import { styles } from "../styles";
import { trpcClient } from "../utils/trpc";

const mapStyles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: 400,
    width: 400,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    height: 300,
    borderRadius: 13,
    width: "100%",
  },
});

function ScheduleItemScreen({ route, navigation }) {
  const event = route.params.eventItem;

  const { data: isEventFavorited, refetch } =
    trpcClient.eventRouter.isEventFavorited.useQuery({
      id: event.id,
    });

  const favoriteEvent =
    trpcClient.userRouter.createFavoriteForUser.useMutation();

  console.log("is favorited", isEventFavorited);

  const LATITUDE_DELTA = 0.28;
  const LONGITUDE_DELTA = LATITUDE_DELTA * (400 / 400);

  return (
    <DefaultScreen>
      <Text style={styles.mainFont}>Location</Text>

      <ScheduleItemCard event={event} />
      <Text style={{ ...styles.baseFont, marginTop: 10, marginBottom: 20 }}>
        {event.description}
      </Text>
      <MapView
        onPress={() =>
          openMap({
            latitude: parseFloat(event?.location?.lat as string),
            longitude: parseFloat(event?.location?.lng as string),

            query: `${event?.location?.line1} ${event?.location?.line2}, ${event?.location?.city}, ${event?.location?.state} ${event?.location?.postal_code}  ${event?.location?.country}`,
          })
        }
        style={mapStyles.map}
        initialRegion={{
          latitude: parseFloat(event?.location?.lat),
          longitude: parseFloat(event?.location?.lng),
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
      >
        <Marker
          coordinate={{
            latitude: parseFloat(event?.location?.lat),
            longitude: parseFloat(event?.location?.lng),
          }}
        />
      </MapView>
      <Button
        text={isEventFavorited ? "Unfavorite" : "Favorite"}
        fontColor="white"
        color="#774736"
        style={{
          marginTop: 20,
        }}
        onPress={async () => {
          await favoriteEvent.mutateAsync({ eventId: event?.id });
          refetch();
        }}
      />
    </DefaultScreen>
  );
}

export { ScheduleItemScreen };
