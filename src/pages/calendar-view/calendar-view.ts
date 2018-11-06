import { Task_Entry } from './../../models/task_entry.model';
import { Task } from './../../models/task.model';
import { SqliteService } from './../../services/sqlite.service';
import { Component, Renderer } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the CalendarViewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-calendar-view',
  templateUrl: 'calendar-view.html',
})
export class CalendarViewPage {

  date: Date;
  daysInThisMonth: number[];
  daysInLastMonth: number[];
  daysInNextMonth: number[];
  daysWithEvents: boolean[];
  monthNames: string[];
  currentMonth: string;
  currentYear: number;
  currentDate: number;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public renderer: Renderer,
              public viewCtrl: ViewController,
              private sqliteService: SqliteService) {
    this.renderer.setElementClass(viewCtrl.pageRef().nativeElement, 'my-popup', true);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CalendarViewPage');
  }

  ionViewWillEnter() {
    this.date = new Date();
    this.monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    this.getDaysOfMonth();
    //this.loadEventThisMonth();
  }

  getDaysOfMonth() {
    this.daysInThisMonth = new Array();
    this.daysInLastMonth = new Array();
    this.daysInNextMonth = new Array();
    this.daysWithEvents = new Array();
    this.currentMonth = this.monthNames[this.date.getMonth()];
    this.currentYear = this.date.getFullYear();

    if(this.date.getMonth() === new Date().getMonth()) {
      this.currentDate = new Date().getDate();
    }
    else {
      this.currentDate = 999;
    }

    /////////////
    var firstDayThisMonth: number = new Date(this.date.getFullYear(), this.date.getMonth(), 1).getDay();
    var prevNumOfDays: number = new Date(this.date.getFullYear(), this.date.getMonth(), 0).getDate();

    for(let i = prevNumOfDays - (firstDayThisMonth - 1); i <= prevNumOfDays; i++) {
      this.daysInLastMonth.push(i);
    }

    /////////////
    var thisNumOfDays: number = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getDate();
    var tasksWithinDate: Task_Entry[];
    this.sqliteService.getTaskByDateRange(new Date(this.date.getFullYear(), this.date.getMonth(), 1), new Date(this.date.getFullYear(), this.date.getMonth(), thisNumOfDays))
    .then((tasks: Task_Entry[]) => {
      //TODO: create a MODEL of Task and Entry relationship inner join
      tasksWithinDate = tasks;


      if(tasksWithinDate.length > 0) {
        for(let i = 0; i < thisNumOfDays; i++) {
          let indexOfEvent = tasksWithinDate.findIndex(data => data.entry_date == this.sqliteService.dateToFormattedString(new Date(this.date.getFullYear(),  this.date.getMonth(), i + 1)));
          if(indexOfEvent == -1) {
            //none found
            this.daysWithEvents.push(false);
          }
          else {
            this.daysWithEvents.push(true);
          }
        }
      }
      else {
        for(let i = 0; i < thisNumOfDays; i++) {
          this.daysWithEvents.push(false);
        }
      }
    })
    .catch(e => {
      console.log(e);
    });

    for(let i = 0; i < thisNumOfDays; i++) {
      this.daysInThisMonth.push(i + 1);

      /*
      if(tasksWithinDate.length > 0) {
        //let indexOfEvent = tasksWithinDate.findIndex(data => data.)
      }
      */

      //this.daysWithEvents.push(false);

      /*this.sqliteService.getTasksByDate(new Date(this.date.getFullYear(), this.date.getMonth(), i + 1))
      .then((tasks: Task[]) => {
        if(tasks.length == 0) {
          this.daysWithEvents[i] = false;
        }
        else if(tasks.length > 0) {
          this.daysWithEvents[i] = true;
        }
      })
      .catch(e => {
        console.log(e);
      });
      */
    }

    ////////////
    var lastDayThisMonth: number = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getDay();
    //var nextNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth() + 2, 0).getDate();

    for(let i = 0; i < (6-lastDayThisMonth); i++) {
      this.daysInNextMonth.push(i+1);
    }

    ///////////
    var totalDays: number = this.daysInLastMonth.length + this.daysInThisMonth.length + this.daysInNextMonth.length;

    if(totalDays<36) {
      for(var i = (7 - lastDayThisMonth); i < ((7 - lastDayThisMonth) + 7); i++) {
        this.daysInNextMonth.push(i);
      }
    }
  }

  goToLastMonth() {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth(), 0);
    this.getDaysOfMonth();
  }

  goToNextMonth() {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth() + 2, 0);
    this.getDaysOfMonth();
  }

}
