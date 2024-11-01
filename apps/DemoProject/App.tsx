import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getHeaderTitle } from "@react-navigation/elements";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Bell,
  Bubbles,
  Calendar,
  ChevronLeft,
  Corner,
  Home,
  Profile,
  Stars,
} from "./Components";
import {
  ChatItemScreen,
  ChatScreen,
  HomeMoreScreen,
  HomeScreen,
  NotificationScreen,
  ProfileScreen,
  ScheduleItemScreen,
  SponsorInfoScreen,
  UpdatesScreen,
} from "./screens";
import { OnboardingScreen } from "./screens/OnboardingScreen";
import { ScheduleScreen } from "./screens/ScheduleScreen";
import { SignupScreen } from "./screens/SignupScreen";
import { trpcClient, TrpcWrapper } from "./utils/trpc";
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const LoadingScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Image
        style={{
          width: 200,
          height: 200,
        }}
        source={require("./assets/logo.png")}
      />
    </View>
  );
};

function MyTabBar({ state, descriptors, navigation }) {
  return (
    <SafeAreaView>
      <View style={{ flexDirection: "row", paddingBottom: 15 }}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              // The `merge: true` option makes sure that the params inside the tab screen are preserved
              navigation.navigate({ name: route.name, merge: true });
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{ flex: 1, maxHeight: 60 }}
            >
              <View
                style={{
                  height: 4,
                  backgroundColor: isFocused ? "#17345b" : "transparent",
                }}
              />

              <View style={{ paddingTop: 15, maxHeight: 40 }}>
                {label === "Chat" && <Bubbles style={{ color: "#17345b" }} />}
                {label === "Schedule" && (
                  <Calendar style={{ color: "#17345b" }} />
                )}
                {label === "Updates" && <Bell style={{ color: "#17345b" }} />}
                {label === "Home" && <Home style={{ color: "#17345b" }} />}
              </View>
              <Text
                style={{
                  color: isFocused ? "#17345b" : "#17345b",
                  alignSelf: "center",
                  paddingBottom: 15,
                }}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const header = ({ navigation, route, options, back }) => {
  const title = getHeaderTitle(options, route.name);
  const showCorner = options.showCorner || false;
  const showStars = options.showStars || false;
  const context = useSafeAreaInsets();

  return (
    <View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          paddingLeft: 20,
          position: "relative",
          paddingRight: 20,
          zIndex: 1,
        }}
      >
        {showStars && (
          <View
            style={{
              position: "absolute",
              right: 50,
              top: 20 + context.top,
            }}
          >
            <Stars />
          </View>
        )}

        {showCorner && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
            }}
          >
            <Corner />
          </View>
        )}

        {back && options.headerLeft !== null && (
          <TouchableOpacity
            style={{ position: "absolute", left: 10, top: context.top }}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <ChevronLeft height={45} width={45} />
          </TouchableOpacity>
        )}
        <Image
          style={{
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: context.top,
            width: 50,
            height: 50,
          }}
          source={require("./Components/icons/circularLogo.png")}
        />
        {options.user && (
          <TouchableOpacity
            style={{ position: "absolute", right: 20, top: context.top }}
            onPress={() => {
              navigation.navigate("ProfileScreen");
            }}
          >
            <Profile height={35} width={35} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const MainApp = () => {
  return (
    <Tab.Navigator tabBar={(props) => <MyTabBar {...props} />}>
      <Tab.Screen
        options={{ headerShown: false, headerLeft: null }}
        name="Home"
        component={HomeScreen}
      />

      <Tab.Screen
        options={{ headerShown: false }}
        name="Schedule"
        component={ScheduleScreen}
      />
      <Tab.Screen
        options={{ headerShown: false, headerLeft: null }}
        name="Updates"
        component={UpdatesScreen}
      />

      <Tab.Screen
        options={{ headerShown: false, headerLeft: null }}
        name="Chat"
        component={ChatScreen}
      />
    </Tab.Navigator>
  );
};

const NavWrapper = () => {
  const user = trpcClient.userRouter.getCurrentUser.useQuery();
  const events = trpcClient.eventRouter.getEvents.useQuery();

  React.useEffect(() => {}, [user.data]);

  if (user.isLoading) {
    return <LoadingScreen />;
  }
  console.log("here");
  return (
    <NavigationContainer key={user?.data?.id || "no_user"}>
      <Stack.Navigator
        initialRouteName={user.data ? "MainApp" : "OnboardScreen"}
        screenOptions={{
          user: user.data,
          header: header,
        }}
      >
        <Stack.Screen
          name="ScheduleItemScreen"
          component={ScheduleItemScreen}
        />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen
          options={{ headerLeft: null, showStars: true, showCorner: true }}
          name="OnboardScreen"
          component={OnboardingScreen}
        />

        <Stack.Screen
          options={{ showStars: false, showCorner: false }}
          name="HomeMoreScreen"
          component={HomeMoreScreen}
        />

        <Stack.Screen name="ChatItemScreen" component={ChatItemScreen} />

        <Stack.Screen
          name="SignupScreen"
          options={{ showStars: true, showCorner: true }}
          component={SignupScreen}
        />
        <Stack.Screen
          name="NotificationScreen"
          component={NotificationScreen}
          options={{ showStars: false, showCorner: true }}
        />

        <Stack.Screen
          name="SponsorInfoScreen"
          component={SponsorInfoScreen}
          options={{ showStars: false, showCorner: true }}
        />
        <Stack.Screen name="MainApp" component={MainApp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

function App() {
  return (
    <TrpcWrapper>
      <NavWrapper />
    </TrpcWrapper>
  );
}

export { App };
