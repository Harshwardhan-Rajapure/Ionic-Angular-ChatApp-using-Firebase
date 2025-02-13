import { Injectable, computed, inject, signal } from '@angular/core';
import { ApiService } from '../api/api.service';
import { DatabaseReference, off, onValue, query } from '@angular/fire/database';
import { AuthService } from '../auth/auth.service';
import { User } from 'src/app/interfaces/user';
import { ChatRoom } from 'src/app/interfaces/chat-room';

@Injectable({
  providedIn: 'root',
})
export class ChatRoomService {
  users = signal<User[] | null>([]);
  chatrooms = signal<ChatRoom[] | null>([]);
  currentUserId = computed(() => this.auth.uid());
  private api = inject(ApiService);
  private auth = inject(AuthService);

  private chatroomRef: DatabaseReference | null = null;
  private chatRoomsListner: any = null;
  private userRef: DatabaseReference | null = null;
  private usersListner: any = null;

  constructor() {}

  init() {
    this.auth.getId();
    this.getChatRooms();
  }

  getUser() {
    this.userRef = this.api.getRef('users');

    //listen to realtime users list (Updated users)
    this.usersListner = onValue(
      this.userRef,
      (snapshot) => {
        if (snapshot?.exists()) {
          const users = snapshot.val();

          const usersArray: User[] = Object.values(users);
          console.log(usersArray);

          const filteredUsers: User[] = usersArray.filter(
            (user) => user.uid !== this.currentUserId()
          );
          this.users.set(filteredUsers);
        } else {
          this.users.set([]);
        }
      },
      (error) => {
        console.error('Error fetching real-time users list:', error);
      }
    );
  }

  async createChatRoom(
    userIds: string[],
    roomName: string,
    type: string = 'private'
  ): Promise<any> {
    try {
      const chatRoomRef = this.api.getRef('chatrooms');
      const userList = [this.currentUserId(), ...userIds];

      const sortedUsersList = userList.sort();
      const usersHash = sortedUsersList.join(',');

      const existingChatRoomQuery = query(
        chatRoomRef,
        this.api.orderByChild('usersHash'), // query by usersHash
        this.api.equalTo(usersHash)
      );

      const existingChatRoomSnapshot = await this.api.getData(
        existingChatRoomQuery
      );

      if (existingChatRoomSnapshot?.exists()) {
        //filter for results for a private chat room
        const chatRooms = existingChatRoomSnapshot.val();

        //check for private chat room
        const privateChatRoom = Object.values(chatRooms).find(
          (chatRoom: any) => chatRoom.type === 'private'
        );

        if (privateChatRoom) {
          return privateChatRoom; //return existing private chat room if found
        }
      }
      // if no matching private chat room exists, create a new one...
      const newChatRoom = this.api.pushData(chatRoomRef);
      const chatRoomId = newChatRoom.key;
      const chatRoomData = {
        id: chatRoomId,
        users: sortedUsersList,
        usersHash,
        name: roomName,
        type,
        createdAt: new Date().toISOString(),
      };
      await this.api.setRefData(newChatRoom, chatRoomData);
      return chatRoomData;
    } catch (error) {
      throw error;
    }
  }

  getChatRooms() {
    this.chatroomRef = this.api.getRef('chatrooms');

    // listen for realtime updates to my chatrooms list
    this.chatRoomsListner = onValue(this.chatroomRef, (snapshot) => {
      if (snapshot?.exists()) {
        const chatrooms = snapshot.val();

        const chatroomkeys = Object.keys(chatrooms);

        const chatroomData = chatroomkeys.map((roomId) => {
          const room = chatrooms[roomId];

          //check if current user is part of the chatroom
          if (
            room.type == 'private' &&
            room.users.includes(this.currentUserId())
          ) {
            // find other user in the chatroom
            const otherUserId = room.users.find(
              (userId: string) => userId !== this.currentUserId()
            );

            return this.getOtherUserDataAndLastMessage(
              otherUserId,
              roomId,
              room,
              room.messages
            );
          }
          // else {
          //   // group chat
          // }
          return null;
        });

        //to execute all promises and filter out null results
        Promise.all(chatroomData)
          .then((chatroomsWithDetails) => {
            const validChatrooms = chatroomsWithDetails.filter(
              (room) => room !== null
            );

            this.chatrooms.set(validChatrooms as ChatRoom[]);
          })
          .catch((e) => {
            console.error(e);
          });
      } else {
        //if no chatrooms found
        this.chatrooms.set([]);
      }
    });
  }

  private async getOtherUserDataAndLastMessage(
    otherUserId: string,
    roomId: string,
    room: any,
    messages: any
  ) {
    try {
      //fetch other user details
      const userRef = this.api.getRef(`users/${otherUserId}`);
      const snapshot = await this.api.getData(userRef);
      const user = snapshot?.exists() ? snapshot.val() : null;

      // fetch last message from chatroom

      let lastMessage: any = null;
      if (messages) {
        const messagesArray = Object.values(messages);
        const sortedMessages = messagesArray.sort(
          (a: any, b: any) => b.timestamp - a.timestamp
        );
        lastMessage = sortedMessages[0];
      }

      //return structured data for the chatroom
      const roomuserData: ChatRoom = {
        roomId,
        name: user?.name || null,
        photo: user?.photo || null,
        room,
        lastMessage: lastMessage?.message || null,
        lastMessageTimestamp: lastMessage?.timestamp || null,
      };

      return roomuserData;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  unsubscribeChatrooms() {
    if (this.chatroomRef) {
      off(this.chatroomRef, 'value', this.chatRoomsListner);
      this.chatroomRef = null; //reset the reference
      this.chatRoomsListner = null;
    }
  }

  unsubscribeUsers() {
    if (this.userRef) {
      off(this.userRef, 'value', this.usersListner);
      this.userRef = null; //reset the reference
      this.usersListner = null;
    }
  }

  unsubscribeUsersAndChatrooms() {
    this.unsubscribeChatrooms();
    this.unsubscribeUsers();
  }

  cleanup() {
    this.unsubscribeChatrooms();
    this.unsubscribeUsers();
    this.users.set(null); //reset signals
    this.chatrooms.set(null); //reset signals
  }
}
