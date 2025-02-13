import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonAvatar,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth/auth.service';
import { addIcons } from 'ionicons';
import {
  logOutOutline,
  personCircleOutline,
  powerOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    IonAvatar,
  ],
})
export class SettingsPage implements OnInit {
  user: any = null;
  profilePicUrl: string = '';

  private auth = inject(AuthService);

  constructor() {
    addIcons({
      powerOutline,
      logOutOutline,
      personCircleOutline,
    });
  }

  ngOnInit() {
    this.loadUser();
  }

  async loadUser() {
    try {
      const userId = this.auth.getId(); // Get UID
      if (userId) {
        this.user = await this.auth.getUserdata(userId); // Fetch user details
        this.setProfilePicture();

      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  }

  setProfilePicture() {
    if (this.user?.name) {
      const firstLetter = this.user.name.charAt(0).toUpperCase(); // Get the first letter of name
      this.profilePicUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${firstLetter}`;
    } else {
      this.profilePicUrl = 'https://api.dicebear.com/7.x/initials/svg?seed=U'; // Default to 'U' for unknown
    }
  }

  logout() {
    this.auth.logout();
  }
}
