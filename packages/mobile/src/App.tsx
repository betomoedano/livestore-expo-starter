import { makeAdapter } from "@livestore/adapter-expo";
import { LiveStoreProvider } from "@livestore/react";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  Button,
  StyleSheet,
  Text,
  unstable_batchedUpdates as batchUpdates,
  View,
} from "react-native";

import { Filters } from "./components/Filters.tsx";
import { ListTodos } from "./components/ListTodos.tsx";
import { Meta } from "./components/Meta.tsx";
import { NewTodo } from "./components/NewTodo.tsx";
import { mutations, schema, tables } from "./livestore/schema.ts";
import { makeWsSync } from "@livestore/sync-cf";

const adapter = makeAdapter({
  sync: {
    makeBackend: ({ storeId }) =>
      makeWsSync({
        storeId,
        url: process.env.EXPO_PUBLIC_LIVESTORE_SYNC_URL,
      }),
  },
});

export const App = () => {
  const [, rerender] = React.useState({});

  return (
    <View style={styles.container}>
      <LiveStoreProvider
        schema={schema}
        storeId="5" // DB for each id
        renderLoading={(_) => <Text>Loading LiveStore ({_.stage})...</Text>}
        renderError={(error: any) => <Text>Error: {error.toString()}</Text>}
        renderShutdown={() => {
          return (
            <View>
              <Text>LiveStore Shutdown</Text>
              <Button title="Reload" onPress={() => rerender({})} />
            </View>
          );
        }}
        boot={(store) => {
          // if (store.query(tables.todos.query.count()) === 0) {
          //   store.mutate(
          //     mutations.addTodo({ id: nanoid(), text: "Make coffee" })
          //   );
          // }
        }}
        adapter={adapter}
        batchUpdates={batchUpdates}
      >
        <InnerApp />
      </LiveStoreProvider>
      <StatusBar style="auto" />
    </View>
  );
};

const InnerApp = () => (
  <>
    <NewTodo />
    <Meta />
    <ListTodos />
    <Filters />
  </>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 32,
  },
});
