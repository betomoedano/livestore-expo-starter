import { createFileRoute, redirect } from "@tanstack/react-router";
import { use } from "react";
import { AuthContext } from "../context/auth";

import { makePersistedAdapter } from "@livestore/adapter-web";
import LiveStoreSharedWorker from "@livestore/adapter-web/shared-worker?sharedworker";
import LiveStoreWorker from "../livestore.worker.ts?worker";
import { LiveStoreProvider } from "@livestore/react";
import { schema } from "@workshop/shared/schema.ts";
import { unstable_batchedUpdates } from "react-dom";
import { NotesList } from "../components/NotesList.tsx";
import { NoteInput } from "../components/NoteInput.tsx";

const storeId = import.meta.env.VITE_LIVESTORE_SYNC_URL.split("://")[0]; // http or https
const TEST_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30";

export const Route = createFileRoute("/")({
  beforeLoad: ({ context }) => {
    if (!context.auth.user) {
      throw redirect({
        to: "/login",
      });
    }
  },
  component: Index,
});

const adapter = makePersistedAdapter({
  worker: LiveStoreWorker,
  sharedWorker: LiveStoreSharedWorker,
  storage: { type: "opfs" },
});

function Index() {
  const { user } = use(AuthContext);

  if (!user) return null;

  return (
    <div className="p-2">
      <h1 className="text-2xl font-bold">Welcome, {user?.name}!</h1>
      <LiveStoreProvider
        schema={schema}
        storeId={"fresh"}
        adapter={adapter}
        batchUpdates={unstable_batchedUpdates}
        renderLoading={({ stage }) => <div>Loading... {stage}</div>}
        renderShutdown={() => <div>Shutting down...</div>}
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
        //   console.log("Booting");
        // }}
        syncPayload={{ authToken: TEST_TOKEN }}
      >
        <NoteInput />
        <NotesList />
      </LiveStoreProvider>
    </div>
  );
}
