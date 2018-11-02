import { SqliteService } from './../../services/sqlite.service';
import { EditTaskPage } from './../edit-task/edit-task';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Task } from '../../models/task.model';

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
              public sqliteService: SqliteService) {
  }


  ionViewDidLoad() {
    console.log('[home.ts] Entering ionViewDidLoad() --------------');
    this.date = new Date();
    this.sqliteService.createAllTables();
    this.sqliteService.getTasksByDate(this.date);
  }

  ionViewWillEnter() {
    console.log('[home.ts] Entering ionViewWillEnter() ------------');
    this.date = new Date();
  }

  createNewTask() {
    this.navCtrl.push(EditTaskPage, {mode: "New"});
  }

  editTask(task: Task) {
    this.navCtrl.push(EditTaskPage, {mode: "Edit", task: task});
  }

}
