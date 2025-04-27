
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.glutenfreeeats.app',
  appName: 'Gluten Free Eats',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true,
    hostname: 'app'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
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
    initialFocus: true,
    minWebViewVersion: 60
  },
  ios: {
    contentInset: "always",
    cordovaSwiftVersion: "5.1",
    preferredContentMode: "mobile"
  }
};

export default config;
