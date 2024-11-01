import CookieManager from "@react-native-cookies/cookies";
import moment from "moment";
import React, { useEffect } from "react";
import { Alert, Text } from "react-native";
import { Button, DefaultScreen, Input, Wave } from "../Components";
import { styles } from "../styles";
import { APP_URL, trpcClient } from "../utils/trpc";

function OnboardingScreen({ navigation }) {
  const signIn = trpcClient.authRouter.signInWithEmail.useMutation();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const context = trpcClient.useContext();

  useEffect(() => {
    CookieManager.getAll().then((cookies) => {
      console.log("CookieManager.getAll =>", cookies);
    });
  });

  return (
    <DefaultScreen shouldShowKeyboardScroll={true}>
      <Text style={{ textAlign: "center", ...styles.mainFont, marginTop: 25 }}>
        Salam!
      </Text>
      <Text
        style={{
          textAlign: "center",
          marginBottom: 40,
          ...styles.baseFont,
          lineHeight: 24,
          marginLeft: 20,
          marginRight: 20,
        }}
      >
        To continue using this app, please{" "}
        <Text style={{ ...styles.boldFont }}>
          sign in or create an account.{" "}
        </Text>
      </Text>

      <Wave />
      <Input
        autoCapitalize="none"
        onChange={(e) => {
          setEmail(e);
        }}
        style={{
          marginTop: 40,
        }}
        placeholder="Your email"
      />
      <Input
        isSecureTextEntry={true}
        autoCapitalize="none"
        style={{
          marginTop: 20,
        }}
        onChange={(e) => {
          setPassword(e);
        }}
        placeholder="Your password"
      />
      <Button
        color="#774736"
        fontColor="white"
        style={{
          marginTop: 20,
        }}
        onPress={async () => {
          const signInResult = await signIn.mutateAsync({
            email: email.trim().toLowerCase(),
            password: password,
          });

          if (signInResult.error) {
            Alert.alert(
              "We encountered an error",
              signInResult.error,
              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
              ],
              {
                cancelable: true,
              }
            );
          }

          if (signInResult.success) {
            await CookieManager.set(APP_URL, {
              name: "jwt",
              value: signInResult.jwt,
              path: "/",
              version: "1",
              expires: moment().add(30, "day").toISOString(),
            }).then((done) => {
              console.log("CookieManager.set =>", done);
            });

            navigation.navigate("NotificationScreen");
          } else {
          }
        }}
        disabled={signIn.isLoading}
        text="Sign In"
      />
      <Button
        text="Sign up now."
        onPress={() => {
          navigation.navigate("SignupScreen");
        }}
      />
    </DefaultScreen>
  );
}

export { OnboardingScreen };
