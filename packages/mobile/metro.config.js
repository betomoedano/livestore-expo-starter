const { getDefaultConfig } = require("expo/metro-config");
let addLiveStoreDevtoolsMiddleware;
if (!process.env.CI){ 
  addLiveStoreDevtoolsMiddleware = require("@livestore/devtools-expo").addLiveStoreDevtoolsMiddleware;
}
const {
  wrapWithReanimatedMetroConfig,
} = require("react-native-reanimated/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.unstable_enableSymlinks = true;
config.resolver.unstable_enablePackageExports = true;
config.resolver.unstable_conditionNames = ["require", "default"];

// Add wasm asset support
config.resolver.assetExts.push("wasm");

// Add COEP and COOP headers to support SharedArrayBuffer
config.server.enhanceMiddleware = (middleware) => {
  return (req, res, next) => {
    res.setHeader("Cross-Origin-Embedder-Policy", "credentialless");
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    middleware(req, res, next);
  };
};

// Add LiveStore Devtools middleware only in a local development environment
if (addLiveStoreDevtoolsMiddleware) {
  addLiveStoreDevtoolsMiddleware(config, {
    schemaPath: "../../packages/shared/schema.ts",
  });
}

module.exports = wrapWithReanimatedMetroConfig(config);
