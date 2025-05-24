# Module 01: Getting started with Expo and Livestore

### Goal

Let's dig into our monorepo containing a Cloudflare durable object worker backend, Vite web frontend, and an Expo cross-platform native mobile app. These all connect to each other to provide a universal local first solution with cloud sync.

### Concepts

- How to get started with local development in Expo
- The basics of running and debugging a universal Livestore app
- Essential information about how Livestore works with Cloudflare durable objects

### Tasks

- Get the Expo frontend running on your device, pointing to Livestore on our workshop's Cloudflare durable object worker.
- Switch over to local development, running the Cloudflare worker locally and connecting to it the web and native mobile frontends.
- Watch Livestore syncing in action through the eyes of the debugging tools.

### Useful links

- [How Livestore works](https://livestore.dev/evaluation/when-livestore/)
- [When to use Livestore / how Livestore scales](https://livestore.dev/evaluation/when-livestore/)

# Exercises

## Exercise 1: Local development, cloud sync

Let's get the mobile app running in everyone's local environment, pointing to the workshop's Cloudflare durable object instance.

To keep things going fast, we're going to use Expo Go to simulate a local React Native development environment. Expo Go is a sandbox environment that can be downloaded right from the App Store, so you don't need to build an app or have an Apple Developer account to get started with building your app. It's a _fixed runtime_, so it can only run certain React Native code, but fortunately everything we're doing today runs in Expo Go.

### Initialize the environment and run the app

1. Run `pnpm install` in the root directory.
2. Run `cd packages/mobile` to switch to the mobile app directory.
3. Run `cp .env.local.example .env.local` to copy the example environment configuration to a local **.env** file.

Notice in the **.env** file is a variable called `EXPO_PUBLIC_LIVESTORE_SYNC_URL`. Make sure this is set to `https://<insert prod url here>`. Variables that start with `EXPO_PUBLIC_` are inlined directly into your code by Metro bundler when you reference them via `process.env`.

4. Run `pnpm run dev` to start the local development environment.
5. Scan the QR Code that appears in the console with your phone.

🏃**Try it.** You're running the app now, and it's connected to the workshop's shared Livestore instance!

### Test-driving Livestore

We have implemented a quick-and-dirty simulation of authentication - you just enter a name in order to fill the "auth token" and cause the sync server to recognize you (more on this later). So, enter a name and try posting something (be nice with your posts, everyone else can see them!).

### Try out the devtools

Livestore includes devtools that let you inspect the state of the sync engine. Make sure you're back online again. Then:

1. In the console, press `Shift + M`.
2. Choose `@livestore/devtools-expo`.

This should open up a browser. Expo devtools plugins are small web apps within your Expo project or an Expo library that can communicate back and forth with your app and tell you information about it.

Let's try some things with the devtools:

#### Browse data in the data browser

This will show you actual tables. You can see the current state of your table, with the schema just as you defined it. You can see the definition of these tables in **packages/shared/schema.ts**.

#### Queries

Go to Queries -> Reactivity Graph, and then create or edit a note. Watch nodes appear and dissappear. This is showing where queries are being re-run live as data is being updated, causing it to refresh in the UI.

In Live Queries, you can see some of the queries that map to the queries in **packages/shared/queries.ts**. These are queries that are predefined and can be fed with a simple variabled into `useQuery`, which then defines some data in a view that you can react to. You can also define a query inline in a `useQuery` hook.

#### Events

Look at the sequence of events as you enter data and others update data, as well. These map to materializers defined in your Livestore configuration. You can see these in **packages/shared/schema.ts**. Each materializer defines a way data can be changed.

This is a good picture of how Livestore fundamentally works - it uses [event sourcing](https://livestore.dev/reference/event-sourcing/), whereby the data is represented as a sequence of immutable changes, or events. The SQLite database is a very efficient "read" model that represents the outcome of applying the events in sequence.

Fortunately, Livestore doesn't need to download every event in order to figure out what is going on; it keeps track of a "cursor" so it can know which events it has reconciled and then requests from the sync server any logs after the cursor. It also must download any new logs from the server before uploading its own. In this way, it works like Git to avoid conflicts, by layering changes in a consistent manner.

#### Sync

You can pause and restart the sync at any time here. Thus, you can simulate a disconnect while still having your phone connected to your local development server and dev tools. Try flipping it on and off while adding notes.

## Exercise 2: Fully-local development

Let's move things over to our own fully-local dev environment, running the mobile app, web app, and cloudflare durable object worker all within your local environment, so you can develop without affecting live data, or even needing anything deployed.

### Switching environments and turning everything on

Both the web and mobile apps have their own environment variables that are used to set the server they're talking to. Let's start the local server and point each one to it, until we have both web and mobile connected to a Cloudflare durable object (three Node processes running at once).

#### In one terminal tab:

1. `cd packages/sync-backend` and run `pnpm run dev` to start the local durable object worker.

#### In a second terminal tab:

2. `cd packages/mobile`
3. Change `EXPO_PUBLIC_LIVESTORE_SYNC_URL` to `http://localhost:8787`
4. Run `pnpm run dev` (restart this if you're already running it). This time, open up an Android emulator or iOS simulator (press `a` or `i`). The Expo CLI will install Expo Go automatically.

#### In a third terminal tab:

5. `cd packages/web`
6. `cp .env.local.example .env.local` to copy the example environment into an actual environment
7. Set `VITE_LIVESTORE_SYNC_URL` to `http://localhost:8787`
8. Run `pnpm run dev` to start the local web development server

🏃**Try it.** You should have two clients and one server running, and the clients should be able to sync with each other. Check the terminal of each process to watch syncing in action.

🏃**Try it (2).** This is also a great time to checkout the devtools again. Both the Expo and web clients have them. On web, check in the console logs for the web devtools link.

> [!NOTE]
> There is also a LiveStore chrome extension available for web that you can download from the [Releases page](https://github.com/livestorejs/livestore/releases). It will be published to the extensions marketplace soon.

> [!NOTE]
> When switching environments, besides changing the URL, it's good to also change the Store ID so your app doesn't try to push data or pull data meant for one environment to another. This starter repo handles this automatically by prefixing the store ID in non-production, but just something good to know.

### More debugging: inspect SQLite state

Now that we're running our own local sync server, we can more closely inspect what is going on with it.

In **packages/sync-backend**, as changes are made, SQLite database files will be updated at **packages/sync-backend/.wrangler/state/v3/d1/miniflare-D1DatabaseObject/**. We can inspect those with an [SQLite viewer](https://marketplace.cursorapi.com/items?itemName=qwtel.sqlite-viewer).

1. Install [SQLite Views](https://marketplace.cursorapi.com/items?itemName=qwtel.sqlite-viewer) from the recommended VS Code extensions.

2. Open one of the files at **packages/sync-backend/.wrangler/state/v3/d1/miniflare-D1DatabaseObject/**. Now you can see its contents.

> [!NOTE]
> The connection to the server can be made using http or ws, both schemes work because the Durable Object only needs one long-lived TCP stream which can be established either way.
> Because both paths stay open, every state update or mutation can immediately flush deltas down the wire, so the UI looks identical.

## Exercise 3: Poking around in Livestore, breaking stuff

There's a lot we could cover and not a lot of time to cover it. Sometimes the best way to learn about something is to work with the largely-finished product and pull some of the wires out to see how it responds. Let's break some stuff!

### Switch your stores

Livestore clients and the sync server (which is more-or-less just another client node in this network) each support multiple stores via a "store ID". Individual stores are indended for small-to-medium pockets of collaboration, like a shared document or workspace. Distinct workspaces, can be split into multple stores with their own distinct event log, so only the active workspace is being synced at any given time when changes occur. Splitting larger workspaces into multiple stores can be an effective way of "scaling horizontally."

Let's change the store ID's, in the process learning a little bit about the LiveStore adapter.

1. In the mobile app, go to **app/(home)/\_layout.tsx**. This is the root layout for any screen that is after the login screen, which is where Livestore syncing is in scope. In Expo Router, a layout is what is rendered before any individual screen inside that folder is rendered. So, it's a useful place for wrapping all or part of the app in context that will be available on any descendent screen.
2. Notice that the entire layout is wrapped in the `LiveStoreProvider`. This defines the active store, the sync connection, and provides various handlers for Livestore events.
3. We use different `storeIds` in prod and local to avoid conflicts. If we use the same `storeId` across environments, LiveStore will try to sync local data created in a different environment, which causes issues. That’s why we separate them. Now, instead of using 'http' or 'https', we can safely set the storeId to something different like, `user.name` or, more precisely, `user?.name.replace(/[^a-zA-Z0-9-]+/g, "-")`, so the store ID is slugified to Livestore's specifications.

🏃**Try it.** The notes should clear out. You're working on a new store of notes.

Let's do the same thing on the web side.

4. In the web app, go to **src/routes/index.tsx** and find the corresponding `LiveStoreProvider`. Change that to `user?.name.replace(/[^a-zA-Z0-9-]+/g, "-")`. "Login" with the same name on web as you are on mobile.

🏃**Try it.** Now multiple clients should be syncing against the new store ID.

5. Switch back to the default `storeId` on both mobile and web. Now you should be syncing the original store again.

### Break the "auth"

The one special thing about the server node is that it also includes a callback for validating an authentication payload. Thus, the server can say which clients are and aren't allowed to sync with the server. We didn't have the time in here to build out a full authentication system, but we at least wanted to demonstrate how these callbacks work.

In a real authentication scenario, you would probably forward a JWT from your authentication system and have the sync server verify the signature. Here, we'll do some simple string validation to demonstrate opening access and restricting access to the sync server.

1. In the mobile app, look back in **app/(home)/\_layout.tsx**, in the `LiveStoreProvider` specifically. There is a `syncPayload` property where user information is being provided. This could be changed to provide an access token or JWT depending on who is logged in.
2. In the **sync-backend** package, look inside **src/index.ts**. `validatePayload` is where the payload that was passed into the `LiveStoreProvider` is evaluated. If the payload is invalid, an error should be thrown.
3. Add this code to `validatePayload` to restrict anyone who isn't named "John":

```ts
if (authToken?.user?.name?.toLowerCase() !== "john") {
  throw new Error("Invalid user");
}
```

🏃**Try it.** Login as "John", see what happens (the logout button is the "door" icon in the lower left. Now login as someone else. You might not see much because we didn't add much handling for this, but if you check the devtools, non-Johns should be disconnected.

(you'll probably want to remove this code now, unless you want to remain being John)

### Break a query

Livestore primarily interfaces with your user interface by way of reactive queries. These queries will cause a rerender anytime that the data returned by the query changes. Livestore apps should only need to use hooks like `useState` for ephemeral state that isn't stored long-term (such as unsubmitted text input and animation state variables).

1. Let's look at the main list of notes in the mobile app, in **components/ListNotes.tsx**. You'll see a query that looks like this:

```tsx
const visibleNotes = useQuery(visibleNotes$);
```

This returns a query result that can then be used when rendering the screen. The query is defined in `visibleNotes$`.

2. Jump over to the `visibleNotes$` definition. It's just a query object stored in **packages/shared**, which is code shared between mobile and web.

3. Modify the query to only return notes where the title contains the word "test":

```diff
export const visibleNotes$ = queryDb(
  tables.note.where({
    deletedAt: null,
+    title: { op: "LIKE", value: "%TEST%" }
  }),
  { label: "visibleNotes" }
);
```

🏃**Try it.** Try adding notes with titles that contains "test" and titles that don't.

4. If you want to inline a query, that's perfectly fine. Go back to **components/ListNotes.tsx** and modify it to inline the same query:

````
```tsx
const visibleNotes = useQuery(queryDb(
  tables.note.where({
    deletedAt: null,
    title: { op: "LIKE", value: "%TEST%" }
  }),
  { label: "visibleNotes" }
));
````

🏃**Try it.** It should work the same.

5. Remove this condition so the query goes back to normal (it'll help for the rest of the workshop).

## Next exercise

[Module 02](02-add-a-feature.md)
