# Module 03: All about deployment

### Goal

Let's learn how to deploy mobile apps with Expo. This part is a little tricky for everyone to do live, because you may need an Apple Developer account, but we can walk through these and you can try them out later if you'd like.

### Concepts

- How Continuous Native Generation to treat native project files as ephemeral resources akin to **node_modules**, created just in time for building.
- Different native builds for production and development, and how to set these up with a dynamic app configuration and environment variables
- How to build and deploy the server solution with Cloudflare Durable Objects
- How to build and deploy all of the frontends with EAS

### Tasks / Demonstration

- Deploy the durable object backend to Cloudflare
- Plan out a comprehensive development / staging / production environment setup for both web and mobile, using a dynamic app config to generate apps for distinct envronments.
- Build those environment versions with EAS Build
- Deploy the web frontend to EAS Hosting

### Useful links
- [Getting started with Cloudflare Durable Objects](https://developers.cloudflare.com/durable-objects/get-started/)

# Exercises

## Exercise 1: Deploy the Cloudflare Durable Object Worker

A Durable Object combines compute with storage into a single Cloudflare worker. At the beginning, our app was communicating with an already deployed worker, and then with a worker running locally. Now, we are going to deploy our own worker to our own Cloudflare account.

1. If you haven't alredy, sign up for a Cloudflare account. SQLite-backed durable objects are [available on the free tier](https://developers.cloudflare.com/durable-objects/platform/pricing/).

2. The first time, you'll need to go to your Cloudflare dashboard (https://dash.cloudflare.com) and click on "Works & Pages" under "Compute" to initialize your workers.dev domain

3. Make sure you're in the **packages/sync-backend** directory (`cd packages/sync-backend`)

4. Login to your Cloudflare account on the CLI by running `npx wrangler login`.

5. Create the SQLite database on Cloudflare: `npx wrangler d1 create livestore-test`

6. Copy the database ID into **wrangler.toml** under `[[d1_databases]]`

> Also, set `new_sqlite_classes = ["WebSocketServer"]` under `[[migrations]]` in **wrangler.toml** in order to use the free Durable Objects offering.

7. Deploy the durable object worker with `npx wrangler deploy`

8. Update your environment variable(s)  to use your new sync server URL. It will look something like `https://websocket-server.[your subdomain].workers.dev`.

🏃**Try it.** You should be able to point your mobile frontend to the URL for your worker and start syncing against it. But... you may want to hang on for a second, because we're going to work on setting up some environments for this.

## Exercise 2(a): Introduction to development builds

Until now, you've been testing your mobile app in Expo Go. This is a great way to try out Expo, but long term, it's not how you want to develop your app. Each React Native app has what we call a "native runtime." The native runtime is the native packages and configuration that define what JavaScript is compatible with the app. The native runtime is compiled into the app and can't change after being built, but JavaScript is embedded (or downloaded), and you can swap out different JS bundles onto the same runtime.

This is how Expo Go works. It's a fixed runtime that happens to be compatible with a good bit of React Native JavaScript. But, there's a lot of packages that aren't in Expo Go that you might want to use (In app purchase is a good example). However, being able to run your code from a development server in Expo Go is pretty convenient. How do we get the best of both worlds?

The answer is a **development build**. This is just a separate build of your app that includes the same app launcher interface as Expo Go, and can thus run any bundle that is compatible with its runtime. Except now, the runtime is completely up to you. You can add native code to your app, rebuild the development build, and continue working just like you were using Expo Go. 

To get a development build, we just need to install the `expo-dev-client` package and then create a debug build of our app.

## Exercise 2(b): App variants in Expo

Now that we've got a development and production environment, let's update our mobile app to dynamically switch between different environments. For good measure, let's add a third, `preview`, in case we add a non-prod database server for testing.

Currently, all the configuration that defines how your Expo app is built into a native binary is enclosed in your **app.json** file. This includes the short name under the app icon, the bundle identifier, the app icon itself, etc. As long as those never change, you could only ever build one environment at a time. If you build a production app and then a development app, the latter would overwrite the former.

However, we can make an **app.config.js** file, which makes that configuration dynamic. Then, by using environment variables, we can change the app names and bundle identifiers based on whether we want a development, preview, or production app. By doing this, we can actually have all three app variants installed on the same phone. We can be developing on our phone one minute, and be testing production in the next.

1. Add the dynamic config by creating the **app.config.js** file inside **packages/mobile**. Add the following code there:

```js
export default ({ config }) => {

  return {
    ...config,
  }
};

```

This will cause the default values to come from **app.js**, and we only have to customize what is unique about each one.

2. Add these customization points based on `APP_VARIANT`:

```js
  function getShortModiferForAppVariant() {
    const appVariant = process.env.APP_VARIANT;

    if (appVariant === "production") {
      return ""
    }
    if (appVariant === "preview" ) {
      return "preview"
    }
    if (appVariant === "development") {
      return "development"
    }
    return ""
  }

  const bundleModifer = getShortModifierForAppVariant();

  const nameModifier = bundleModifier !== "" ? (bundlerModifier.toUpperCase() + " ") : "";

  return {
    ...config,
    name: nameModifier + config.name,
    ios: {
      ...config.ios,
      bundleIdentifier: config.ios.bundleIdentifier + bundleModifier,
    },
    android: {
      ...config.android,
      package: config.android.package + bundleModifier,
    }
  }
```

3. Update the **package.json** `dev` script to use `APP_VARIANT=development`:

```json
  "dev": "APP_VARIANT=development expo start"
```

🏃**Try it.** You can run `pnpm run dev` and now it'll use the `development` variant values when running the app. However, we don't yet have an app to run it in. Let's fix that.

## Exercise 3: Building with EAS Build

Let's build and deploy our `development` and `production` builds with EAS Build, setting up environments along the way.

### Initialize EAS Build

1. If you don't already have one, create an account at https://expo.dev (a free account will do)
2. Install the EAS CLI (`npm install -g eas-cli`)
3. Inside **packages/mobile**, run `eas init`. This will setup a project on EAS.
4. Run `eas build:configure`. This will setup an eas.json file with build profiles for development, preview, and production.

### Setup environments

Since we have different environments with their own environment variables, we're going to use EAS environment variables to configure those so they are stored in the cloud, but can also be used locally.

1. Go to https://expo.dev, open your project, then "Environment Variables"

2. Setup the following environment variables for `development`:

```
EXPO_PUBLIC_LIVESTORE_SYNC_URL=https://localhost:8787
APP_VARIANT=development
```

3. Setup the following environment variables for `preview` and `production`:

```
EXPO_PUBLIC_LIVESTORE_SYNC_URL=[your livestore sync url]
```

4. Setup the following enviroment variables for `preview`:
```
APP_VARIANT=preview
```

5. Setup the following enviroment variables for `production`:
```
APP_VARIANT=production
```

6. Apply these environments to your build profiles in **eas.json**:

```json
development: {
  ...
  "environment": "development",
},
preview: {
  ...
  "environment": "preview",
},
production: {
  ...
  "environment": "production",
}

```

This means that, when you build an app with one of these profiles, the corresponding environment will be applied automatically.

You can also manually bring an environment locally by running `eas env:pull`.

### About deploying to phones (Apple, specifically)

Of course, before we build, we need to understand a little about how apps end up on phones, because (quite often) one does not simply install an app that they just built on a phone! (unfortunately)

#### Android

Android is quite simple. The `development` and `preview` profiles will build a .apk file, which can be sideloaded. The `production` profile will build an .aab, which must be uploaded to the Play Store.

#### Apple

Apple doesn't allow sideloading. You need an Apple Developer account to deploy to a device (though you do not need an account to deploy to a simulator). Two deployment methods apply:

- Testflight / Store deployment (upload to App Store Connect, download via Testflight app (pre-prod) or App Store (prod))
- Ad hoc distribution (register a device ID to a provisioning profile, which is then used when building the app, so all eligable devices for installation are defined at build time)

By default, the `development` and `preview` profiles will use ad-hoc distribution. Prior to building, you will need to register devices so they can be included in the provisioning profile when built. 

The easiest way to do this is with the `eas device:create` command. Run this to generate a link that you can give to everyone who will run your app. They can follow the prompts, and it will register their device ID on EAS. Then, next time you build, that device ID will be available to be included with your build.

### Let's build!

Finally, it's time for us to build! Fortunately, with that setup, it's pretty easy from this point forward to get exactly what we want.

#### Making a development build

Run `eas build --profile development --platform [platform]`

#### Making a preview build

Run `eas build --profile preview --platform [platform]`

We'll use this as a proxy for our production build for the moment. It's the same as our production build, other than that it can be installed via sideloading (Android) or ad-hoc distribution (iOS).

🏃**Try it.** Build for development and preview. Install both on a device. Switch bewteen local development and testing a preproduction standalone version.

#### Submit to stores

When building for the stores (using the `production` profile), you can choose to upload your app manually to the Play Store Console or App Store Connect, or you can do some extra configuration and then use the `--auto-submit` flag to automatically submit your app after a successful build on EAS. [Learn more](https://docs.expo.dev/submit/introduction/).

## Exercise 4: Deploying the web frontend with EAS Hosting

Expo apps can also target web. Currently, Livestore for web doesn't yet support Expo due to some differences in module compatibility with Metro bundler as compared to Vite, but even today, you can deploy the web app to EAS Hosting.

Quite fortunately with Vite is that it exports production apps in the same format that EAS Hosting deploy expects (it's all in the **dist** folder). We just need to do some initial setup, build the app, and deploy.

1. Create an **app.json** file in **packages/web**. The main purpose here is to set the name of our project. You could even technically use the same name as your mobile project, but you don't have to:

```json
{
  "name": "Livestore Demo",
  "slug": "livestore-web-frontend"
}
```

2. Run `pnpm run build` to export the app to the **dist** folder

3. Run `eas deploy`

🏃**Try it.** Try to navigate to the URL that is output by `eas deploy`.

## See the solution

[Solution PR](https://github.com/keith-kurak/expo-router-codemash-2025-starter/pull/1)
