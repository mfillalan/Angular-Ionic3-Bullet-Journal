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

  deleteTask(rowid: number) {
    console.log("Deleting rowid: " + rowid);
    this.sqliteService.deleteTask(rowid).then((rowid: number) => {
      var index: number = this.sqliteService.tasks.findIndex(item => item.rowid === rowid);
      this.sqliteService.tasks.splice(index, 1);
    })
    .catch(e => {
      console.log(e);
    });
  }

  changeCompleted(task: Task) {
    if(task.completed == 0) {
      task.completed = 1;
    }
    else {
      task.completed = 0;
    }
    this.sqliteService.updateTask(task).then((rTask: Task) => {
      var index: number = this.sqliteService.tasks.findIndex(item => item.rowid === rTask.rowid);
      this.sqliteService.tasks[index] = rTask;
    })
    .catch(e => {
      console.log(e);
    });
  }

}
