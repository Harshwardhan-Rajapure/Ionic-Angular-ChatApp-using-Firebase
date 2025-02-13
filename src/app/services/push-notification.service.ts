import { Injectable } from '@angular/core';
import { Database, ref, set, update } from '@angular/fire/database';
import { PushNotifications } from '@capacitor/push-notifications';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class PushNotificationService {
  constructor(
    private database: Database,
    private auth: Auth
  ) {}

  initializePushNotifications() {
    // Request permission to use push notifications
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        // Register with Apple/Google to receive push via FCM
        PushNotifications.register();
      }else {
        console.warn('Push notification permission denied.');
      }
    });

    // Listen for successful registration
    PushNotifications.addListener('registration', (token) => {
      console.log('Push registration success, token:', token.value);
      // Save this token to your database or server for sending notifications
      this.saveFcmToken(token.value);
    });

    // Listen for registration errors
    PushNotifications.addListener('registrationError', (error) => {
      console.error('Push registration error:', error);
    });

    // Listen for incoming push notifications
    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Push received:', notification);
    });

    // Listen for notification taps
    PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
      console.log('Push action performed:', notification);
    });
  }

  async saveFcmToken(token: string) {
    try {
      // Get current user
      const currentUser = this.auth.currentUser;
      
      if (currentUser) {
        // Reference to the user's node in the database
        const userRef = ref(this.database, `users/${currentUser.uid}`);
        
        // Update fcmToken using update instead of set
        await update(userRef, {
          fcmToken: token
        });

        console.log('FCM Token saved successfully');
      } else {
        console.error('No user is currently logged in');
      }
    } catch (error) {
      console.error('Error saving FCM token:', error);
    }
  }
}