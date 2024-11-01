import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { DefaultScreen } from "../Components";
import { styles } from "../styles";
import { trpcClient } from "../utils/trpc";

function HomeScreen({ navigation }) {
  const { data: homeInfoData } =
    trpcClient.infoRouter.getHomeScreenInfo.useQuery();

  const { data: sponsorInfo } = trpcClient.infoRouter.getSponsorInfo.useQuery();

  return (
    <DefaultScreen>
      <ScrollView>
        <Text style={styles.mainFont}> About </Text>

        <View
          style={{
            marginBottom: 50,
            backgroundColor: "white",
            width: "100%",
            padding: 15,
            borderRadius: 13,
          }}
        >
          {homeInfoData && (
            <View>
              <Text style={styles.subFont}>{homeInfoData?.value}</Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("HomeMoreScreen");
                }}
                style={{}}
              >
                <Text
                  style={{
                    ...styles.mainFont,
                    fontSize: 14,
                    marginLeft: "auto",
                    marginTop: 10,
                  }}
                >
                  Read More
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Text style={styles.mainFont}>Sponsors</Text>
        {sponsorInfo?.map((sponsorInfoItem) => {
          console.log(sponsorInfoItem);
          if (sponsorInfoItem.logo) {
            return (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("SponsorInfoScreen", {
                    item: sponsorInfoItem,
                  });
                }}
                style={{
                  ...styles.container,
                  marginTop: 20,
                  width: "100%",
                  position: "relative",
                  justifyContent: "center",
                }}
              >
                <Image
                  style={{
                    width: 200,
                    height: 200,
                    marginLeft: "auto",
                    marginRight: "auto",
                    resizeMode: "center",
                  }}
                  source={{
                    uri: sponsorInfoItem.logo,
                  }}
                ></Image>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("SponsorInfoScreen", {
                      item: sponsorInfoItem,
                    });
                  }}
                >
                  <Text
                    style={{
                      ...styles.mainFont,
                      fontSize: 14,
                      marginLeft: "auto",
                      marginTop: 10,
                    }}
                  >
                    Read More
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            );
          } else {
            return (
              <View
                style={{ ...styles.container, marginTop: 20 }}
                key={sponsorInfoItem.id}
              >
                <Text>{sponsorInfoItem.name}</Text>
              </View>
            );
          }
        })}
      </ScrollView>
    </DefaultScreen>
  );
}

export { HomeScreen };
