import { CalendarViewPage } from './../calendar-view/calendar-view';
import { SqliteService } from './../../services/sqlite.service';
import { EditTaskPage } from './../edit-task/edit-task';
import { Component } from '@angular/core';
import { NavController, ModalController, FabContainer } from 'ionic-angular';
import { Task } from '../../models/task.model';
import * as anime from 'animejs';

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
  todaysDate: Date = new Date();

  constructor(public navCtrl: NavController,
              public modalCtrl: ModalController,
              public sqliteService: SqliteService) {
  }


  ionViewDidLoad() {
    console.log('[home.ts] Entering ionViewDidLoad() --------------');
    this.todaysDate = new Date();
    this.date = new Date();
    this.sqliteService.createAllTables();
    this.sqliteService.getTasksByDate(this.date).then((tasks: Task[]) => {
      this.sqliteService.tasks = tasks;
      this.sqliteService.sortTasks();
    });
  }

  ionViewWillEnter() {
    console.log('[home.ts] Entering ionViewWillEnter() ------------');
    this.todaysDate = new Date();
  }

  changeDate(curDate: Date) {
    let presentCalendar = this.modalCtrl.create(CalendarViewPage);
    presentCalendar.present();
  }

  createNewTask() {
    let presentNewTask = this.modalCtrl.create(EditTaskPage, {mode: "New"});
    presentNewTask.onWillDismiss(data => {
      if(data instanceof Task) {
        anime({
          targets: '#task_' + data.rowid,
          translateX: 100,
          opacity: 0,
          easing: 'easeInElastic',
          elasticity: 300,
          direction: 'reverse',
          duration: 1500
        });
      }
    });
    presentNewTask.present();
  }

  editTask(task: Task) {
    let presentEditTask = this.modalCtrl.create(EditTaskPage, {mode: "Edit", task: task});

    presentEditTask.onDidDismiss(data => {
      if(data instanceof Task) {

      }
    })

    presentEditTask.present();
  }

  deleteTask(rowid: number) {
    console.log("Deleting rowid: " + rowid);
    this.sqliteService.deleteTask(rowid).then((rowid: number) => {
      var index: number = this.sqliteService.tasks.findIndex(item => item.rowid == rowid);
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
      if(index == -1) {
        //do nothing
      }
      else {
        this.sqliteService.tasks[index] = rTask;
      }

    })
    .catch(e => {
      console.log(e);
    });
  }

  closeFab(fab: FabContainer) {
    fab.close();
  }

}
