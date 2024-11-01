import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect } from "react";
import { View } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { trpcClient } from "../utils/trpc";
function ChatItemScreen({ route }) {
  const insets = useSafeAreaInsets();
  const forumCategory = route.params.category;

  const {
    data: messages,
    isLoading: isLoadingMessages,
    refetch: refetchMessages,
    fetchNextPage,
  } = trpcClient.forumRouter.getMessagesForCategories.useInfiniteQuery(
    {
      category: route.params.id,
    },
    {
      refetchInterval: 5000,
      networkMode: "online",
      getNextPageParam: (lastPage) => {
        return lastPage?.cursor;
      },
    }
  );

  useEffect(() => {
    if (messages) {
      AsyncStorage.setItem(forumCategory.id, `${messages?.pages[0]?.total}}`);
    }
  }, [messages]);

  const sendMessage =
    trpcClient.forumRouter.createNewMessageForCategory.useMutation();

  const currentUser = trpcClient.userRouter.getCurrentUser.useQuery();

  if (currentUser.isLoading || isLoadingMessages) {
    return null;
  }

  const loadedMessages = messages?.pages
    .map((page) => {
      return page?.messages?.map((item) => {
        return {
          _id: item.id,
          user: {
            _id: item?.user?.id,
            name: item?.user?.name,
          },
          text: item.message,
        };
      });
    })
    .flat();

  const unique = [
    ...new Map(loadedMessages.map((item) => [item["_id"], item])).values(),
  ];

  return (
    <GiftedChat
      onLoadEarlier={() => fetchNextPage()}
      infiniteScroll={true}
      loadEarlier={true}
      behavior="padding"
      renderUsernameOnMessage={true}
      wrapInSafeArea={true}
      bottomOffset={insets.bottom}
      forceGetKeyboardHeight={false}
      messages={unique}
      renderLoadEarlier={() => null}
      messagesContainerStyle={{}}
      renderComposer={(props) => {
        if (forumCategory.is_one_way) {
          return <View></View>;
        } else {
          return undefined;
        }
      }}
      onSend={async (messages) => {
        await sendMessage.mutateAsync({
          category: route.params.id,
          message: messages[0].text,
        });
        await refetchMessages();
      }}
      user={{
        _id: currentUser.data.id,
        name: currentUser.data.name,
      }}
    />
  );
}

export { ChatItemScreen };
