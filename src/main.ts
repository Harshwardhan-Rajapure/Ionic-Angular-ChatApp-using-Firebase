import { bootstrapApplication } from '@angular/platform-browser';
import {
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
  PreloadAllModules,
} from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, indexedDBLocalPersistence, initializeAuth, provideAuth } from '@angular/fire/auth';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { Capacitor } from '@capacitor/core';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'firebase-ionic-chatapp',
        appId: '1:279648439644:web:4c8c22d4bf1e984c414599',
        databaseURL:
          'https://firebase-ionic-chatapp-default-rtdb.asia-southeast1.firebasedatabase.app',
        storageBucket: 'firebase-ionic-chatapp.firebasestorage.app',
        apiKey: 'AIzaSyDpg3SAkZTC6osT0B70EtiCctLFW_40YQw',
        authDomain: 'fir-ionic-chatapp.firebaseapp.com',
        messagingSenderId: '279648439644',
      })
    ),
    // provideAuth(() => getAuth()),
    provideAuth(() => {
      if(Capacitor.getPlatform() == 'ios') {
        return initializeAuth(getApp(), {
          persistence: indexedDBLocalPersistence
        })
      }
      return getAuth();
    }),
    provideDatabase(() => getDatabase()),
    provideMessaging(() => getMessaging()),
    provideStorage(() => getStorage()),
  ],
});
