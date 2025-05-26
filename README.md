# LiveStore Workshop 2025

A modern monorepo project featuring a web application, mobile Expo app, and sync server for real-time data synchronization.

You can find the presentation slides [here](https://www.figma.com/slides/AGWkVPMesfxSDK6kt302nz/LiveStore-Workshop-2025?node-id=2003-49&t=0yrzDwTf2DU39tVI-1)

Refer to the [/lessons](/lessons/) directory for step-by-step workshop instructions and exercises.

## Project Structure

This project is organized as a monorepo using npm workspaces with the following packages:

- `packages/web`: Web application
- `packages/mobile`: Mobile application
- `packages/sync-backend`: Backend service for data synchronization
- `packages/shared`: Abstracted elements to share across packages, mostly types and LiveStore schema and queries

## Prerequisites

- [Node.js](https://nodejs.org/) (Latest LTS version recommended)
- [pnpm](https://pnpm.io/) - Used as package manager and runtime
- [Set up your environment](https://docs.expo.dev/get-started/set-up-your-environment/?mode=expo-go&platform=ios&device=simulated) - Needed to run simulators/emulators in your computer

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/betomoedano/livestore-workshop-app
   cd livestore-workshop-app
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Configure environment variables:

   For the mobile app, create a `.env.local` file in the `packages/mobile` directory:

   ```bash
   cd packages/mobile
   cp .env.local.example .env.local
   ```

   Then edit the `.env.local` file to set your sync server URL:

   ```
   EXPO_PUBLIC_LIVESTORE_SYNC_URL=http://localhost:8787
   ```

   For the web app, create a `.env.local` file in the `packages/web` directory:

   ```bash
   cd packages/web
   cp .env.local.example .env.local
   ```

   Then edit the `.env.local` file to set your sync server URL:

   ```
   VITE_LIVESTORE_SYNC_URL=http://localhost:8787
   ```

4. Set up the Cloudflare D1 database for the sync backend: (OPTIONAL - You can do this in localhost)

   ```bash
   cd packages/sync-backend
   ```

   Create a new D1 database in Cloudflare:

   ```bash
   npx wrangler d1 create livestore-sync-cf-demo
   ```

   This will output something like:

   ```
   ✅ Successfully created DB 'livestore-sync-cf-demo' in account 'your-account'
   Created database 'livestore-sync-cf-demo' with ID: fd58992d-e1fd-45a2-9e41-2f1bbe80f7ea
   ```

   Update the `wrangler.toml` file with your database ID:

   ```toml
   [[d1_databases]]
   binding = "DB"
   database_name = "livestore-sync-cf-demo"
   database_id = "your-database-id-here"
   ```

5. Start the development servers:

   For the web application:

   ```bash
   cd packages/web
   pnpm run dev
   ```

   For the mobile application:

   ```bash
   cd packages/mobile
   pnpm run dev
   ```

   For the sync backend:

   ```bash
   cd packages/sync-backend
   pnpm run dev
   ```
