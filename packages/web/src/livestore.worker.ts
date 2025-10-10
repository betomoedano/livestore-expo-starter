import { makeWorker } from "@livestore/adapter-web/worker";
import { makeWsSync  } from "@livestore/sync-cf/client";

import { schema } from "@workshop/shared/schema";

const url = import.meta.env.VITE_LIVESTORE_SYNC_URL;

makeWorker({
  schema,
  sync: {
    backend: makeWsSync({ url }),
    // initialSyncOptions: { _tag: "Blocking", timeout: 5000 },
  },
});
