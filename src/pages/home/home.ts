import { SqliteService } from './../../services/sqlite.service';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Entry } from '../../models/entry.model';

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

  entries: Entry[] = [];

  constructor(public navCtrl: NavController,
              private sqliteService: SqliteService) {
    this.entries = this.sqliteService.entries;
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

  addEntry() {
    this.sqliteService.addEntry();
  }

  loadEntry() {
    this.sqliteService.loadAllEntries()
    .then(res => {
      this.entries = this.sqliteService.entries;
    });
  }

  deleteEntries() {
    for(var i=0; i < this.entries.length; i++) {
      this.sqliteService.deleteEntry(this.entries[i].rowid);
    }
    this.entries = this.sqliteService.entries;
  }

}
