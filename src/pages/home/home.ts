import { SqliteService } from './../../services/sqlite.service';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  monthNames: string[] = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
  ];
  dayNames: string[] = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

  date: Date = new Date();

  constructor(public navCtrl: NavController,
              private sqliteService: SqliteService) {

  }

  ionViewWillEnter() {
    console.log('[home.ts] Entering ionViewWillEnter() ------------');
   
  }

  ionViewDidLoad() {
    console.log('[home.ts] Entering ionViewDidLoad() --------------');
    
    this.sqliteService.loadAllTasks();
    this.sqliteService.loadAllEntries();
    this.sqliteService.loadAllGoals();
    this.sqliteService.loadAllReusableTasks();
  }

}
