import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-players',
  templateUrl: './players.page.html',
  styleUrl: './players.page.scss',
  imports: [IonContent, RouterLink],
})
export class PlayersPage {}
