import { Platform, Text } from "react-native";
import {
  Notifications,
  Registered,
  RegistrationError,
} from "react-native-notifications";
import { Button, DefaultScreen } from "../Components";
import { styles } from "../styles";
import { trpcClient } from "../utils/trpc";
const NotificationScreen = ({ navigation }) => {
  const saveNotificationToken =
    trpcClient.notificationRouter.addNotificationToken.useMutation();
  const context = trpcClient.useContext();
  return (
    <DefaultScreen>
      <Text style={styles.mainFont}>Notifications</Text>

      <Text style={{ ...styles.baseFont }}>
        {" "}
        If you'd like to receive notifications and alerts, allow us access.{" "}
      </Text>

      <Button
        text={"Allow notifications"}
        onPress={async () => {
          const hasPermissions: boolean =
            await Notifications.isRegisteredForRemoteNotifications();

          Notifications.registerRemoteNotifications();
          Notifications.events().registerRemoteNotificationsRegistered(
            async (event: Registered) => {
              await saveNotificationToken.mutateAsync({
                token: event.deviceToken,
                platform: Platform.OS === "ios" ? "ios" : "android",
              });
              context.invalidate();
              navigation.navigate("MainApp");
            }
          );
          Notifications.events().registerRemoteNotificationsRegistrationFailed(
            (event: RegistrationError) => {
              navigation.navigate("MainApp");
            }
          );
        }}
      />

      <Button
        text={"Skip"}
        onPress={() => {
          context.invalidate();
          navigation.navigate("MainApp");
        }}
      />
    </DefaultScreen>
  );
};

export { NotificationScreen };
