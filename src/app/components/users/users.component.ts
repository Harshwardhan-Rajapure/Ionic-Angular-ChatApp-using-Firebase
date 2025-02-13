import { Component, OnInit, input, output } from '@angular/core';
import {
  IonIcon,
  IonLabel,
  IonImg,
  IonAvatar,
  IonItem,
  IonList,
  IonContent,
  IonButton,
  IonButtons,
  IonTitle,
  IonToolbar,
  IonHeader,
} from '@ionic/angular/standalone';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonLabel,
    IonImg,
    IonAvatar,
    IonItem,
    IonList,
    IonContent,
    IonButton,
    IonButtons,
    IonTitle,
    IonToolbar,
    IonHeader,
  ],
})
export class UsersComponent implements OnInit {
  users = input<User[] | null>([]);
  close = output<boolean>();
  user = output<User>();

  constructor() {}

  ngOnInit() {}

  closeModal() {
    this.close.emit(true);
  }

  startChat(user: User) {
    this.user.emit(user);
  }

  getUserPhoto(user: User): string {
    if (user?.name) {
      const firstLetter = user.name.charAt(0).toUpperCase(); // Get first letter
      return `https://api.dicebear.com/7.x/initials/svg?seed=${firstLetter}0`;
    } else {
      return `https://api.dicebear.com/7.x/initials/svg?seed=U`; // Default avatar
    }
  }
}
