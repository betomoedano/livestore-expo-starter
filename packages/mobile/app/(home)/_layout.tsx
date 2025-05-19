import "../../polyfill.ts";
import React, { use } from "react";
import { nanoid } from "@livestore/livestore";
import { makePersistedAdapter } from "@livestore/adapter-expo";
import { LiveStoreProvider, useStore } from "@livestore/react";
import {
  Button,
  Text,
  unstable_batchedUpdates as batchUpdates,
  View,
  Pressable,
} from "react-native";
import { Redirect, Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { events, schema } from "@workshop/shared/schema";
import { makeCfSync } from "@livestore/sync-cf";
import { AuthContext } from "../../context/auth.tsx";
import { loadEnvironment } from "../../utils/load-environment.ts";

const adapter = makePersistedAdapter({
  sync: { backend: makeCfSync({ url: loadEnvironment() }) },
});

const storeId = loadEnvironment().split("://")[0]; // http or https

export default function RootLayout() {
  const { user } = use(AuthContext);
  const [, rerender] = React.useState({});
  const router = useRouter();

  if (!user) {
    return <Redirect href="/(auth)" />;
  }

  return (
    <LiveStoreProvider
      schema={schema}
      storeId={storeId}
      renderLoading={(_) => <></>}
      renderError={(error: any) => <Text>Error: {error.toString()}</Text>}
      renderShutdown={() => {
        return (
          <View>
            <Text>LiveStore Shutdown</Text>
            <Button title="Reload" onPress={() => rerender({})} />
          </View>
        );
      }}
      // boot={(store) => {
      //   if (store.query(tables.note.count()) === 0) {
      //     store.commit(
      //       events.noteCreated({
      //         id: nanoid(),
      //         title: "Welcome to Expo",
      //         content:
      //           "The best way to build mobile apps. Powered by LiveStore.",
      //         createdBy: "The Expo Team",
      //       })
      //     );
      //   }
      // }}
      adapter={adapter}
      batchUpdates={batchUpdates}
      syncPayload={{
        authToken: user.jwt,
      }}
    >
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: `Welcome, ${user.name}`,
            headerStyle: {
              backgroundColor: "#F2F2F7",
            },
            headerShadowVisible: false,
            headerRight: ({ tintColor }) => {
              const { store } = useStore();
              return (
                <Pressable
                  onPress={() => {
                    const id = nanoid();
                    store.commit(
                      events.noteCreated({
                        id,
                        title: "",
                        content: "",
                        createdBy: user.name,
                      })
                    );
                    router.push({
                      pathname: "/[note]",
                      params: { note: id },
                    });
                  }}
                >
                  <Ionicons
                    name="add"
                    size={30}
                    color={tintColor}
                    style={{ marginRight: 10 }}
                  />
                </Pressable>
              );
            },
          }}
        />
        <Stack.Screen
          name="[note]"
          options={{
            title: "Note",
          }}
        />
        <Stack.Screen
          name="reaction/[note]"
          options={{
            title: "Reaction",
            presentation: "formSheet",
            sheetAllowedDetents: [0.3, 0.7],
            headerShown: false,
            sheetGrabberVisible: true,
          }}
        />
      </Stack>
    </LiveStoreProvider>
  );
}
