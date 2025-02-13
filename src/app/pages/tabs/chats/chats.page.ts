import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { addCircle, arrowBack, chatbubblesOutline } from 'ionicons/icons';
import { UsersComponent } from 'src/app/components/users/users.component';
import { ChatRoomService } from 'src/app/services/chat-room/chat-room.service';
import { User } from 'src/app/interfaces/user';
import { NavigationExtras, Router } from '@angular/router';
import { ChatRoom } from 'src/app/interfaces/chat-room';
import { EmptyScreenComponent } from 'src/app/components/empty-screen/empty-screen.component';
import { IonAvatar, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonImg, IonItem, IonLabel, IonList, IonModal, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    UsersComponent,
    EmptyScreenComponent,
    IonModal,
    IonHeader, 
    IonToolbar, 
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonList,
    IonItem,
    IonAvatar,
    IonImg,
    IonLabel,
  ],
})
export class ChatsPage implements OnInit {
  isNewChat = signal<boolean>(false);
  users = computed<User[] | null>(() => this.chatroom.users());
  chatrooms = computed<ChatRoom[] | null>(() => this.chatroom.chatrooms());

  model = {
    icon: 'chatbubbles-outline',
    title: 'No Chat Rooms',
    color: 'warning',
  };

  private chatroom = inject(ChatRoomService);
  private router = inject(Router);

  constructor() {
    addIcons({
      addCircle,
      arrowBack,
      chatbubblesOutline,
    });
  }

  ngOnInit(): void {
    this.chatroom.init();
  }

  getChatroomPhoto(chatroom: ChatRoom): string {
 if (chatroom?.name) {
      const firstLetter = chatroom.name.charAt(0).toUpperCase(); // Get first letter
      return `https://api.dicebear.com/7.x/initials/svg?seed=${firstLetter}0`;
    } else {
      return `https://api.dicebear.com/7.x/initials/svg?seed=U`; // Default avatar
    }
  }

  setIsNewChat(value: boolean) {
    // call users data
    if (!this.users() || this.users()?.length == 0) this.chatroom.getUser();
    this.isNewChat.set(value);
  }

  async startChat(user: User, modal: IonModal) {
    try {
      const room = await this.chatroom.createChatRoom([user.uid], user.name);
      //dismiss modal
      modal.dismiss();

      //navigate to chatPage
      this.navigateToChat(user?.name, room?.id);
    } catch (error) {
      console.log(error);
    }
  }

  getChat(chatroom: ChatRoom) {
    this.navigateToChat(chatroom?.name!, chatroom?.roomId);
  }

  navigateToChat(name: string, id: string) {
    const navData: NavigationExtras = {
      queryParams: {
        name,
      },
    };

    this.router.navigate(['/', 'tabs', 'chats', id], navData);
  }

  ngOnDestroy() {
    this.chatroom.cleanup();
  }
}
