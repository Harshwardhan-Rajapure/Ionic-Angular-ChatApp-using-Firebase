import { Injectable, computed, inject, signal } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Chat } from 'src/app/interfaces/chat';
import { AuthService } from '../auth/auth.service';
import { DatabaseReference, off, onValue } from '@angular/fire/database';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  chatMessgaes = signal<Chat[] | null>(null);
  private api = inject(ApiService);
  private auth = inject(AuthService);
  currentUserId = computed(() => this.auth.uid());

  private chatsRef: DatabaseReference | null = null;
  private chatsListner: any = null;

  constructor() {}

  init(chatroomId:string) {
    this.auth.getId();
    this.getChatMessages(chatroomId)
  }

  async sendMessage(chatroomId: string, message: string) {
    try {
      const chatsRef = this.api.getRef(`chatrooms/${chatroomId}/messages`);

      // prepare msg object

      const chatData: Chat = {
        senderId: this.currentUserId()!,
        message,
        timestamp: Date.now(),
      };

      //push new msg to chatroom's  msg's node
      const newMessageRef = this.api.pushData(chatsRef);
      await this.api.setRefData(newMessageRef, chatData);
    } catch (error) {
      throw error;
    }
  }

  getChatMessages(chatroomId: string) {
    this.chatsRef = this.api.getRef(`chatrooms/${chatroomId}/messages`);

    //realtime chat msg's within chatroom
    this.chatsListner = onValue(
      this.chatsRef,
      (snapshot) => {
        if (snapshot?.exists()) {
          const messages = snapshot.val();

          const messagesArray: Chat[] = Object.keys(messages).map(
            (messageId) => ({
              id: messageId,
              ...messages[messageId],
              isCurrentUser:
                messages[messageId].senderId == this.currentUserId()
                  ? true
                  : false,
            })
          );

          this.chatMessgaes.set(messagesArray);
        } else {
          this.chatMessgaes.set([]);
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  unsubscribeChats() {
    if (this.chatsRef) {
      off(this.chatsRef, 'value', this.chatsListner);
      this.chatsRef = null;
      this.chatsListner = null;

      this.chatMessgaes.set(null);
    }
  }
}
