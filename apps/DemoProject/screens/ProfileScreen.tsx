import CookieManager from "@react-native-cookies/cookies";
import { Text } from "react-native";
import { Button, DefaultScreen } from "../Components";
import { styles } from "../styles";
import { trpcClient } from "../utils/trpc";

const ProfileScreen = ({ navigation }) => {
  const user = trpcClient.userRouter.getCurrentUser.useQuery();
  const deleteAccount = trpcClient.userRouter.deleteAccount.useMutation();
  const context = trpcClient.useContext();

  return (
    <DefaultScreen>
      <Text style={styles.mainFont}>Your Settings</Text>

      <Button
        text={"Log out"}
        onPress={async () => {
          context.invalidate();
          context.userRouter.invalidate();
          context.userRouter.getCurrentUser.invalidate();

          await CookieManager.clearAll();

          await user.refetch();
          navigation.navigate("OnboardScreen");
        }}
      />

      <Button
        text={"Notifications"}
        onPress={async () => {
          navigation.navigate("NotificationScreen");
        }}
      />

      <Button
        text={"Delete your account"}
        onPress={async () => {
          await deleteAccount.mutateAsync();
          context.invalidate();
          context.userRouter.invalidate();
          context.userRouter.getCurrentUser.invalidate();

          await CookieManager.clearAll();

          await user.refetch();
          navigation.navigate("OnboardScreen");
        }}
      />
    </DefaultScreen>
  );
};

export { ProfileScreen };
