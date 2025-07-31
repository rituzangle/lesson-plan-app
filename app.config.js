export default ({ config }) => ({
  ...config,
  name: "Lesson Plan App",
  slug: "lesson-plan-app",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icons/icon.png",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/icons/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.rituzangle.lessonplanapp",
    buildNumber: "1.0.0"
  },
  android: {
    package: "com.rituzangle.lessonplanapp"
  },
  platforms: ["ios", "web"],
  updates: {
    fallbackToCacheTimeout: 0
  },
  runtimeVersion: {
    policy: "sdkVersion"
  },
  jsEngine: "hermes",  // keep Hermes for native
  web: {
    jsEngine: "jsc"
  }
});
