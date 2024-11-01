import CheckBox from "@react-native-community/checkbox";
import CookieManager from "@react-native-cookies/cookies";
import moment from "moment";
import React from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import DatePicker from "react-native-date-picker";
import { Dropdown } from "react-native-element-dropdown";
import { Button, DefaultScreen, Input } from "../Components";
import { styles } from "../styles";
import { APP_URL, trpcClient } from "../utils/trpc";

function SignupScreen({ route, navigation }) {
  const signupForAccount = trpcClient.authRouter.createUser.useMutation();
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [password2, setPassword2] = React.useState("");
  const [gender, setGender] = React.useState("");
  const [didAgreeToTerms, setDidAgreeToTerms] = React.useState(false);
  const [bithday, setBirthday] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const isButtonDisabled = () => {
    if (
      email.length > 0 &&
      name.length > 0 &&
      password.length > 0 &&
      password2.length > 0 &&
      didAgreeToTerms &&
      gender.length > 0 &&
      bithday
    ) {
      return false;
    } else {
      return true;
    }
  };

  return (
    <DefaultScreen shouldShowKeyboardScroll={true} showBottomCorner={true}>
      <View style={{ width: "100%" }}>
        <Text style={{ ...styles.mainFont, textAlign: "center" }}>
          {" "}
          Sign Up{" "}
        </Text>
        <Text style={{ textAlign: "center" }}>
          Complete the information to create a profile.{" "}
        </Text>
        <Input
          style={{
            marginTop: 20,
          }}
          autoCapitalize="words"
          onChange={setName}
          placeholder="Your name"
          autoCorrect={false}
        />
        <Input
          style={{
            marginTop: 20,
          }}
          autoCapitalize="none"
          onChange={setEmail}
          autoCorrect={false}
          placeholder="Your email"
        />
        <Input
          style={{
            marginTop: 20,
          }}
          autoCapitalize="none"
          isSecureTextEntry={true}
          onChange={setPassword}
          autoCorrect={false}
          placeholder="Create your password"
        />
        <Input
          style={{
            marginTop: 20,
          }}
          isSecureTextEntry={true}
          autoCapitalize="none"
          autoCorrect={false}
          onChange={setPassword2}
          placeholder="Re-type your password"
        />

        <View
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <Dropdown
            style={{
              marginTop: 20,
              width: "50%",
              height: 50,
              marginBottom: 20,
              backgroundColor: "white",
              padding: 15,
            }}
            selectedTextStyle={{
              color: "#141d26",
            }}
            placeholderStyle={{
              color: "#141d26",
            }}
            onChange={(value: { value: string }) => {
              setGender(value.value);
            }}
            value={gender}
            valueField={"value"}
            labelField="label"
            placeholder="Gender"
            data={[
              {
                label: "Male",
                value: "male",
              },
              {
                label: "Female",
                value: "female",
              },
            ]}
          />

          <DatePicker
            modal
            mode="date"
            open={open}
            date={new Date()}
            onConfirm={(date) => {
              setOpen(false);
              setBirthday(date);
            }}
            onCancel={() => {
              setOpen(false);
            }}
          />
          <TouchableOpacity
            onPress={() => {
              setOpen(true);
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                marginLeft: 15,
                width: "100%",
                height: 50,
                padding: 15,
              }}
            >
              {bithday ? (
                <Text style={{ color: "black" }}>
                  {" "}
                  {bithday.toLocaleDateString()}{" "}
                </Text>
              ) : (
                <Text style={{ color: "black" }}> Set Birthday </Text>
              )}
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <CheckBox
            value={didAgreeToTerms}
            onValueChange={(e) => {
              setDidAgreeToTerms(e);
            }}
          />
          <Text style={{ marginLeft: 10 }}>
            {" "}
            I agree to the Terms and Conditions{" "}
          </Text>
        </View>
        <Button
          color="#774736"
          style={{
            marginTop: 20,
          }}
          fontColor="white"
          disabled={isButtonDisabled() || signupForAccount.isLoading}
          onPress={async () => {
            if (password !== password2) {
              Alert.alert(
                "We encountered an error",
                "Passwords do not match",
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
            } else {
              const { token, error } = await signupForAccount.mutateAsync({
                gender: gender,
                birthday: bithday,
                name: name,
                email: email.trim().toLowerCase(),
                password: password,
              });

              if (error) {
                Alert.alert(
                  "We encountered an error",
                  error,
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

              await CookieManager.set(APP_URL, {
                name: "jwt",
                value: token,
                path: "/",
                version: "1",
                expires: moment().add(30, "day").toISOString(),
              }).then((done) => {
                navigation.navigate("NotificationScreen");
              });
            }
          }}
          text={"Create your Account."}
        />
      </View>
    </DefaultScreen>
  );
}

export { SignupScreen };
