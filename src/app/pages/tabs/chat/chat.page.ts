import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Keyboard } from '@capacitor/keyboard';
import { Platform } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  checkmarkDoneOutline,
  chatbubblesOutline,
  send,
  personCircle,
  callOutline,
  videocamOutline,
  ellipsisVerticalOutline,
} from 'ionicons/icons';
import { ChatBoxComponent } from 'src/app/components/chat-box/chat-box.component';
import { EmptyScreenComponent } from 'src/app/components/empty-screen/empty-screen.component';
import { ChatService } from 'src/app/services/chat/chat.service';
import {
  IonIcon,
  IonButton,
  IonSpinner,
  IonItem,
  IonToolbar,
  IonFooter,
  IonList,
  IonContent,
  IonBackButton,
  IonButtons,
  IonTitle,
  IonHeader,
  IonTextarea,
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: true,
  imports: [
    ChatBoxComponent,
    EmptyScreenComponent,
    IonIcon,
    IonButton,
    IonSpinner,
    IonItem,
    IonToolbar,
    IonFooter,
    IonList,
    IonContent,
    IonBackButton,
    IonButtons,
    IonTitle,
    IonHeader,
    IonTextarea,
    FormsModule,
  ],
})
export class ChatPage implements OnInit {
  content = viewChild<IonContent>(IonContent);

  name = signal<string | null>(null);
  id = signal<string | null>(null);
  message = signal<string | null>(null);

  isLoading = signal<boolean>(false);

  model = {
    icon: 'chatbubbles-outline',
    title: 'No Chats',
    color: 'medium',
  };

  chats = computed(() => this.chatService.chatMessgaes());
  private route = inject(ActivatedRoute);
  private chatService = inject(ChatService);

  @ViewChild('messageInput') messageInput!: ElementRef;
  @ViewChild('content') content1: any;

  constructor(private platform: Platform) {
    this.initializeKeyboardListeners();

    effect(() => {
      if (this.chats() && this.chats()?.length! > 0) {
        setTimeout(() => {
          this.scrollToBottom();
        }, 500);
      }
    });
    addIcons({
      checkmarkDoneOutline,
      chatbubblesOutline,
      send,
      personCircle,
      callOutline,
      videocamOutline,
      ellipsisVerticalOutline,
    });
  }

  ngOnInit() {
    const data: any = this.route.snapshot.queryParams;
    if (data?.name) {
      this.name.set(data.name);
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      //return back
      return;
    }
    this.id.set(id);
    this.chatService.init(id);
  }

  private async initializeKeyboardListeners() {
    if (this.platform.is('mobile')) {
      // Show listener
      Keyboard.addListener('keyboardWillShow', (info) => {
        console.log('Keyboard Height:', info.keyboardHeight);
        
        document.documentElement.style.setProperty('--keyboard-height', `${info.keyboardHeight}px`);
        document.body.classList.add('keyboard-is-open');
  
        // Wait for keyboard animation, then scroll
        setTimeout(() => {
          this.content1?.scrollToBottom(300);
        }, 300);
      });
  
      // Hide listener
      Keyboard.addListener('keyboardWillHide', () => {
        document.documentElement.style.setProperty('--keyboard-height', '0px');
        document.body.classList.remove('keyboard-is-open');
      });
    }
  }
  

  handleEnterPress(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();

    if (!keyboardEvent.shiftKey) {
      this.sendMessage();
    }
  }

  scrollToBottom() {
    this.content()?.scrollToBottom(500);
  }

  async sendMessage() {
    if (!this.message() || this.message()?.trim() == '') {
      //show toast (Please enter proper message!)
      return;
    }

    try {
      this.setIsLoading(true);

      await this.chatService.sendMessage(this.id()!, this.message()!);

      this.message.set('');
      this.setIsLoading(false);
      this.scrollToBottom();
    } catch (error) {
      this.setIsLoading(false);
      console.log(error);
    }
  }

  setIsLoading(value: boolean) {
    this.isLoading.set(value);
  }

  ngOnDestroy() {
    this.chatService.unsubscribeChats();
  }
}
