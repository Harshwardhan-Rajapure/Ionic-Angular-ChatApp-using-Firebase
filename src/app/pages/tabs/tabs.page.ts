import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonIcon,
  IonTabButton,
  IonTabBar,
  IonTabs,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { call, chatbubbles, cog, radio } from 'ionicons/icons';
@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonIcon,
    IonTabButton,
    IonTabBar,
    IonTabs
  ],
})
export class TabsPage implements OnInit {
  constructor() {
    addIcons({ chatbubbles, radio, call, cog });
  }

  ngOnInit() {}
}
