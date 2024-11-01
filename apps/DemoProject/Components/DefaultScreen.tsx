import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomCorner } from "./icons";
export const DefaultScreen = ({
  children,
  shouldShowKeyboardScroll = false,
  showBottomCorner = true,
}) => {
  const context = useSafeAreaInsets();
  if (shouldShowKeyboardScroll) {
    return (
      <View
        style={{
          position: "relative",
          height: "100%",
          width: "100%",
        }}
      >
        <KeyboardAwareScrollView
          contentContainerStyle={{
            alignItems: "center",
            zIndex: 100,
          }}
          style={{
            position: "relative",
            marginTop: 20,
            elevation: 10,
            paddingLeft: 20,
            paddingRight: 20,
            zIndex: 100,
            paddingBottom: 20,
            height: "100%",
            width: "100%",
            flex: 1,
          }}
        >
          {children}
        </KeyboardAwareScrollView>
        {showBottomCorner && (
          <View
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
            }}
          >
            <BottomCorner />
          </View>
        )}
      </View>
    );
  }

  return (
    <View
      style={{
        position: "relative",
        marginTop: 20,
        elevation: 10,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 20,
        height: "100%",
        width: "100%",
        flex: 1,
        alignItems: "center",
      }}
    >
      {children}
    </View>
  );
};
