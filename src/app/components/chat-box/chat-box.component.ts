import { DatePipe } from '@angular/common';
import { Component, OnInit, input } from '@angular/core';
import { Chat } from 'src/app/interfaces/chat';
import {
  IonIcon,
  IonText,
  IonNote,
  IonItem,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss'],
  standalone: true,
  imports: [
    DatePipe,
    IonIcon,
    IonText,
    IonNote,
    IonItem,
  ],
})
export class ChatBoxComponent implements OnInit {
  chat = input<Chat | null>(null);

  constructor() {
    // addIcons({
    //   checkmarkDoneOutline
    // })
  }

  ngOnInit() {}
}
