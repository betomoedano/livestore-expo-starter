# Local First Conf 2025 Workshop: Expo | Livestore

Workshop starter template for the Expo / Livestore workshop at Local First Conference 2025.

## How to use this repo

1. Fork the [companion repo](https://github.com/betomoedano/livestore-expo-starter). You'll start working right on the `main` branch.
2. Start at the first module by opening up the file starting with `01-`.
3. Do the rest of the modules in order.

## Prerequisites / How to be ready for the workshop

Make sure these steps are done ahead of time to be ready to start working on the workshop exercises.

### 1. Make sure these are installed on your computer

- [Node LTS version (18+)](https://nodejs.org/en)
- [Visual Studio Code](https://code.visualstudio.com/)
- pnpm installed (https://pnpm.io/installation)
- Web browser (any modern browser should do)
- Android Studio and/or XCode setup for local development. Follow the instructions here: https://docs.expo.dev/guides/local-app-development/. We only need these for the sake of using the Android emulator or iOS simulator (having just one is fine, but great if you can setup both).

This workshop is compatible with macOS, Windows, and Linux, but macOS is preferred for the iOS simulator access.

### 2. Install Expo Go on your mobile device

Expo Go is a sandbox for running React Native code on your phone.

- [Install Expo Go on your device from your phone's app store](https://expo.dev/go)

We will use your mobile device at least at the beginning to test against a real cloud instance, though you'll likely want to use the emulator or simulator for the rest of the workshop.

### 3. Download the starter repo and make sure it works

1. Fork and clone the [Starter repo](https://github.com/betomoedano/livestore-expo-starter) to your computer. (Github desktop or Github CLI work just fine for this)

2. Open the project in Visual Studio Code and install the recommended extensions when it prompts you do to so.

3. Restore dependencies with

`pnpm install`

#### Test your mobile setup

4. Run `cd packages/mobile` and then `pnpm run dev`.

5. Press `i` or `a` to install Expo Go on your emulator / simulator.

6. Scan the QR code to run on your deivce.

If all of these work, you're in great shape for the mobile exercises.

#### Test your web setup

7. Run `cd packages/mobile` and then `pnpm run dev`
