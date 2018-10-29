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


  ionViewDidLoad() {
    console.log('[home.ts] Entering ionViewDidLoad() --------------');
    this.date = new Date();

    
    this.sqliteService.loadAllEntries();
    this.sqliteService.loadAllGoals();
    this.sqliteService.loadAllReusableTasks();
    this.sqliteService.loadAllTasks();
  }

  ionViewWillEnter() {
    console.log('[home.ts] Entering ionViewWillEnter() ------------');
    this.date = new Date();
  }

  addEntry() {
    this.sqliteService.addEntry().then(res => {
      this.checkIfEntryExists(this.date);
      this.loadEntry();
    });
  }

  addTask() {
    this.checkIfEntryExists(this.date).then((res: boolean) => {
      if(!res) {
        //TODO:
        //add entry for today
        this.sqliteService.addEntry().then((res: number) => {
          this.sqliteService.addTask(new Task(null, "test", "testing", 0, 0, null, res, null))
          .then(res => {
            console.log("New task added with rowid: " + res);
            this.tasks = this.sqliteService.tasks;
          });
        })
        .catch(e => {
          console.log("!! error: " );
          console.log(e);
        })
        //add the task with the entry id
      }
      else {
        //TODO:
        //add the task with current entry id
        this.sqliteService.getEntryRowId(this.date).then((rowid: number) => {
          this.sqliteService.addTask(new Task(null, "test", "testing", 0, 0, null, rowid, null))
          .then(res => {
            this.tasks = this.sqliteService.tasks;
          });
        })
      }
    })
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
        this.checkIfEntryExists(this.date);
      });
    }
  }

  deleteTasks() {
    //TODO:
    //Create deleteTask() function in sqliteService.
    for(var i=0; i < this.tasks.length; i++) {
      this.sqliteService.deleteTask(this.tasks[i].rowid).then(res => {
        this.tasks = this.sqliteService.tasks;
      });
    }
  }

  /**
   * @desc
   * @param date
   * @returns Promise that resolves type boolean
   * @resolves boolean
   */
  checkIfEntryExists(date: Date): Promise<{}> {
    console.log("Entering CheckIfEntryExists...");

    return new Promise((resolve, reject) => {
      this.sqliteService.checkIfEntryExists(date).then((res: boolean) => {
        this.todayEntryExists = res;
        resolve(res);
      });
    });

  }

  /*
  dateToFormattedString(date: Date) {
    var yyyy = date.getFullYear().toString();
    var mm = (date.getMonth() + 1).toString();
    var dd = date.getDate().toString();

    return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);
  }
  */

}
