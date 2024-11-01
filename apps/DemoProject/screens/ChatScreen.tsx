import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { DefaultScreen } from "../Components";
import { styles } from "../styles";
import { trpcClient } from "../utils/trpc";
function ChatScreen() {
  const {
    data: getForumCategories,
    isLoading,
    refetch,
  } = trpcClient.forumRouter.getForumCategories.useQuery();
  const navigate = useNavigation();

  const [updatedSet, setUpdatedSet] = React.useState([]);

  useEffect(() => {
    const doThis = async () => {
      const array = [];
      for (let index = 0; index < getForumCategories.length; index++) {
        const element = getForumCategories[index];
        element.asyncCount = await AsyncStorage.getItem(element.category.id);
        array.push(element);
      }
      setUpdatedSet(array);
    };

    doThis();
  }, [getForumCategories]);

  useFocusEffect(() => {
    refetch();
  });

  if (isLoading)
    return (
      <DefaultScreen>
        <Text>Loading...</Text>
      </DefaultScreen>
    );

  return (
    <DefaultScreen>
      <ScrollView style={{ width: "100%", height: "100%" }}>
        <Text style={{ textAlign: "center", ...styles.mainFont }}>Forums</Text>

        {updatedSet?.map((category) => {
          const count = category.asyncCount
            ? parseInt(category.asyncCount, 10)
            : 0;

          let modifiedCount = category.count - count;
          if (modifiedCount === 0) modifiedCount = 0;
          if (modifiedCount < 0) modifiedCount = 0;

          return (
            <TouchableOpacity
              style={{ width: "100%" }}
              key={category.category.id}
              onPress={() => {
                navigate.navigate("ChatItemScreen", {
                  id: category.category.id,
                  category: category.category,
                });
              }}
            >
              <View style={{ ...styles.container, marginTop: 20 }}>
                {modifiedCount > 0 && (
                  <View
                    style={{
                      width: 35,
                      height: 35,
                      borderRadius: 50,
                      backgroundColor: "#17345b",
                      position: "absolute",
                      right: 10,

                      top: 10,
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 16,
                        marginTop: "auto",
                        marginBottom: "auto",
                        marginLeft: "auto",
                        marginRight: "auto",
                      }}
                    >
                      {modifiedCount}
                    </Text>
                  </View>
                )}
                <Text style={styles.headerFont}>{category.category.name}</Text>
                <Text style={styles.cardDescription}>
                  {category?.message?.message}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </DefaultScreen>
  );
}

export { ChatScreen };
