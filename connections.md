# Working around connection issues / lack of mobile emulator / simulator availability

Everyone's computing setup is a little different, so it's not unexpected if dozens of people in a workshop room don't all get their phones connected to a dev server / local livestore instance, etc., over a wifi network they've never connected to before today.

If things don't work at first, here's some workarounds to try.

## Issues connecting from dev server to Expo Go on physical device over WLAN
Try out the `--tunnel` option to run your dev server over an ngrok HTTPS address. This is a little slower, but is tolerant of misbehaving or non-existent wifi.

## No emulator / simulator available (no Mac and/or no Xcode or Android Studio installed)
You will need to use an emulator / simulator when connecting to your local livestore; usually a physical device will not work without messing around with your network or firewall.

However, if all you have available is a device with Expo Go, it's still possible to connect to a local dev server via (once again) ngrok.

1. Run the **sync-backend** project
2. Go to ngrok.com, sign up if you haven't already.
3. Go to the setup page: `https://dashboard.ngrok.com/get-started/setup/macos`
4. Follow the steps there, but when you get to running `ngrok` with an ephemeral domain, run: `ngrok http http://localhost:8087` so you're forwarding the sync backend worker.
5. In **packages/mobile/.env.local**, set `EXPO_PUBLIC_LIVESTORE_SYNC_URL` to the URL output from the `ngrok` command.
6. Run the app in Expo Go on your device.

This works fine with the `ngrok` setup above for forwarding your dev server over a public URL. Yes, you'll have two different `ngrok`'s running.

### What about the Livestore devtools?
If you're using the workaround above to do Module 01, Exercise 02 on your device, you'll still have issues running the Livestore devtools at this time. However, you can get most of the experience by running the web app at the same time and checking out the devtools that way. They're really almost the same. Note that the web app will continue to use `http://localhost:8787` if connecting to a local sync backend.