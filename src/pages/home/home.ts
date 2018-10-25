import { Task } from './../../models/task.model';
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
  tasks: Task[] = [];

  todayEntryExists: boolean = false;

  constructor(public navCtrl: NavController,
              private sqliteService: SqliteService) {
    this.entries = this.sqliteService.entries;
    this.tasks = this.sqliteService.tasks;
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
    this.sqliteService.addEntry().then(res => {
      this.checkIfEntryExists();
      this.loadEntry();
    });
  }

  addTask() {

  }

  loadEntry() {
    this.sqliteService.loadAllEntries()
    .then((res: Entry[]) => {
      this.entries = res;
    });
  }

  deleteEntries() {
    for(var i=0; i < this.entries.length; i++) {
      this.sqliteService.deleteEntry(this.entries[i].rowid).then(res => {
        this.entries = this.sqliteService.entries;
        this.checkIfEntryExists();
      });
    }
  }

  checkIfEntryExists() {
    console.log("Entering CheckIfEntryExists...");
    var date = new Date();
    console.log("Date: " + this.dateToFormattedString(date));
    this.sqliteService.checkIfEntryExists(this.dateToFormattedString(date)).then((res: boolean) => {
      this.todayEntryExists = res;
    });
  }

  dateToFormattedString(date: Date) {
    var yyyy = date.getFullYear().toString();
    var mm = (date.getMonth() + 1).toString();
    var dd = date.getDate().toString();

    return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);
  }

}
