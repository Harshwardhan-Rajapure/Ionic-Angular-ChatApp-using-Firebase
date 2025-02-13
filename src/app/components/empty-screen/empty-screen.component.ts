import { Component, OnInit, input } from '@angular/core';
import {
  IonIcon,
  IonLabel,
  IonCol,
  IonRow,
  IonGrid,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-empty-screen',
  templateUrl: './empty-screen.component.html',
  styleUrls: ['./empty-screen.component.scss'],
  standalone: true,
  imports: [IonIcon, IonLabel, IonCol, IonRow, IonGrid],
})
export class EmptyScreenComponent implements OnInit {
  model = input<any>();

  constructor() {}

  ngOnInit() {}
}
