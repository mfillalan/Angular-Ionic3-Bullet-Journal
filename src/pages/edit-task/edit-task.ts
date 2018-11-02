import { SqliteService } from './../../services/sqlite.service';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { Task } from '../../models/task.model';

@IonicPage()
@Component({
  selector: 'page-edit-task',
  templateUrl: 'edit-task.html',
})
export class EditTaskPage implements OnInit {

  //navParams {mode, task}
  mode: string = "Add";
  task: Task;

  date: Date = new Date();

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private sqliteService: SqliteService) {
  }

  ngOnInit() {
    this.mode = this.navParams.get('mode');
    if(this.mode == "Edit") {
      this.task = this.navParams.get('task');
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditTaskPage');
    this.date = new Date();
  }

  onAddItem(form: NgForm) {

    this.sqliteService.getEntryRowId(this.date).then((entryId: number) => {

      var completed: number = 0;

      if(form.value.taskCompleted) {
        completed = 1;
      }
      else {
        completed = 0;
      }

      if(entryId == -1) {
        //no entryid was returned
        this.sqliteService.addEntry(this.date).then((entryId: number) => {
          this.sqliteService.addTask(new Task(null, form.value.taskName, form.value.taskDesc, completed, 0, null, entryId, null))
            .then((task: Task) => {
              this.sqliteService.tasks.push(task);
              form.reset();
              this.navCtrl.pop();
            })
            .catch(e => {
              console.log(e);
            });
        });
      }
      else {
        //entryid found
        this.sqliteService.addTask(new Task(null, form.value.taskName, form.value.taskDesc, completed, 0, null, entryId, null))
          .then((task: Task) => {
            this.sqliteService.tasks.push(task);
            form.reset();
            this.navCtrl.pop();
          })
          .catch(e => {
            console.log(e);
          });
      }
    })



  }

}
