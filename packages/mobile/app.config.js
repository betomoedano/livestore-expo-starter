function getShortModifierForAppVariant() {
  const appVariant = process.env.APP_VARIANT;

  if (appVariant === "production") {
    return "";
  }
  if (appVariant === "preview") {
    return "preview";
  }
  if (appVariant === "development") {
    return "development";
  }
  return "";
}

export default ({ config }) => {
  const bundleModifier = getShortModifierForAppVariant();

  const nameModifier =
    bundleModifier !== "" ? bundleModifier.toUpperCase() + " " : "";

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
    },
  };
};
