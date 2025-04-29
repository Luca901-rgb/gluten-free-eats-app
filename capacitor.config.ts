import { CapacitorConfig } from '@capacitor/cli';
const config: CapacitorConfig = {
  appId: 'com.glutenfreeeats.app',
  appName: 'Gluten Free Eats',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true,
    url: 'file:///android_asset/public/index.html'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#FFFFFF",
      launchAutoHide: true,
      splashFullScreen: true,
      splashImmersive: false
    },
    Keyboard: {
      resize: "body",
      resizeOnFullScreen: true
    },
    CapacitorHttp: {
      enabled: true
    }
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true,
    useLegacyBridge: true,
    initialFocus: true
  },
  ios: {
    contentInset: "always",
    cordovaSwiftVersion: "5.1",
    preferredContentMode: "mobile"
  }
};
export default config;
