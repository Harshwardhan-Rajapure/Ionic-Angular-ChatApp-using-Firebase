import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mychatapp',
  appName: 'My ChatApp',
  webDir: 'www',
  server: {
    androidScheme: 'https',
  },
 plugins: {
  PushNotifications:{
    presentationOptions: ["badge", "sound", "alert"]
  },
  },
  android: {
    allowMixedContent: true  
  }
};

export default config;