import { CalendarViewPage } from './../calendar-view/calendar-view';
import { SqliteService } from './../../services/sqlite.service';
import { EditTaskPage } from './../edit-task/edit-task';
import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { Task } from '../../models/task.model';
import { DatePicker } from '@ionic-native/date-picker';

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
              public modalCtrl: ModalController,
              public sqliteService: SqliteService,
              private datePicker: DatePicker) {
  }


  ionViewDidLoad() {
    console.log('[home.ts] Entering ionViewDidLoad() --------------');
    this.date = new Date();
    this.sqliteService.createAllTables();
    this.sqliteService.getTasksByDate(this.date);
  }

  ionViewWillEnter() {
    console.log('[home.ts] Entering ionViewWillEnter() ------------');
  }

  changeDate(curDate: Date) {
    let presentCalendar = this.modalCtrl.create(CalendarViewPage);
    presentCalendar.present();
    /*
    this.datePicker.show({
      date: curDate,
      mode: 'date'
    })
    .then(
      (date: Date) => {
        this.date = date;
        this.sqliteService.getTasksByDate(this.date).then((tasks: Task[]) => {
          this.sqliteService.tasks = tasks;
        });
      },
      err => { console.log(err); }
    )
    .catch(e => {
      console.log(e);
    });
    */
  }

  createNewTask() {
    let presentNewTask = this.modalCtrl.create(EditTaskPage, {mode: "New"});
    presentNewTask.onDidDismiss(data => {
      if(data instanceof Task) {
        this.sqliteService.tasks.push(data);
      }
    });
    presentNewTask.present();
  }

  editTask(task: Task) {
    let presentEditTask = this.modalCtrl.create(EditTaskPage, {mode: "Edit", task: task});
    presentEditTask.present();
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

}
