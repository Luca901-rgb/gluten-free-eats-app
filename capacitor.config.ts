
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.glutenfreeeats.app',
  appName: 'Gluten Free Eats',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
    allowNavigation: ['*'],
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#FFFFFF",
      androidScaleType: "CENTER_CROP",
      launchAutoHide: true,
      showSpinner: true,
      spinnerColor: "#FF5733"
    },
    Keyboard: {
      resize: "body",
      style: "dark",
      resizeOnFullScreen: true
    },
    LocalNotifications: {
      smallIcon: "ic_stat_restaurant",
      iconColor: "#FF5733"
    },
    Geolocation: {
      permissions: {
        android: {
          highAccuracy: true
        },
        ios: {
          alwaysPromptForPermission: false
        }
      }
    }
  },
  android: {
    backgroundColor: "#FFFFFF",
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true,
    minSdkVersion: 22,
    hideLogs: false,
    buildOptions: {
      keystorePath: null,
      keystorePassword: null,
      keystoreAlias: null,
      keystoreAliasPassword: null,
      releaseType: null
    }
  },
  ios: {
    preferredContentMode: "mobile",
    cordovaSwiftVersion: "5.0",
    contentInset: "always"
  }
};

export default config;
