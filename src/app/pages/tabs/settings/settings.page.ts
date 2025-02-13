import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
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
import { logOutOutline, personCircleOutline, powerOutline } from 'ionicons/icons';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonIcon ],
})
export class SettingsPage implements OnInit {
  private auth = inject(AuthService);
  constructor() {
    addIcons({
     powerOutline,
     logOutOutline,
     personCircleOutline
    });
  }

  ngOnInit() {}

  logout() {
    this.auth.logout();
  }
}
