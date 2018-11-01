import { SqliteService } from './../../services/sqlite.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { Task } from '../../models/task.model';

@IonicPage()
@Component({
  selector: 'page-edit-task',
  templateUrl: 'edit-task.html',
})
export class EditTaskPage {

  mode: string = "Add";
  date: Date = new Date();

  constructor(public navCtrl: NavController, public navParams: NavParams, private sqliteService: SqliteService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditTaskPage');
    this.date = new Date();
  }

  onAddItem(form: NgForm) {

    this.sqliteService.getEntryRowId(this.date).then((entryId: number) => {
      if(entryId == -1) {
        //no entryid was returned
        this.sqliteService.addEntry(this.date).then((entryId: number) => {
          this.sqliteService.addTask(new Task(null, form.value.taskName, form.value.taskDesc, 0, 0, null, entryId, null))
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
        this.sqliteService.addTask(new Task(null, form.value.taskName, form.value.taskDesc, 0, 0, null, entryId, null))
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
