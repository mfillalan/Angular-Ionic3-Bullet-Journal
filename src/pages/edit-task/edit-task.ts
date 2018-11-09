import { SqliteService } from './../../services/sqlite.service';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { Task } from '../../models/task.model';

@IonicPage()
@Component({
  selector: 'page-edit-task',
  templateUrl: 'edit-task.html',
})
export class EditTaskPage implements OnInit {

  //navParams {mode, task}
  mode: string = "New"; //"New" or "Edit"
  task: Task;
  currentTasks: Task[] = this.sqliteService.tasks;

  taskForm: FormGroup;
  task_name: string = "";
  task_desc: string = "";
  task_completed: boolean = false;
  task_parentId: number = -1;

  date: Date = new Date();

  constructor(public navParams: NavParams,
              public viewCtrl: ViewController,
              private sqliteService: SqliteService) {
  }

  ngOnInit() {
    this.mode = this.navParams.get('mode');
    if(this.mode == "Edit") {
      this.task = this.navParams.get('task');
      this.task_name = this.task.name;
      this.task_desc = this.task.desc;
      this.task_completed = (this.task.completed == 1 ? true : false);
      this.task_parentId = this.task.parent_Task_id;
    }
    else {
      this.task_parentId = -1;
    }
  }

  private initializeForm() {
    this.taskForm = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'desc': new FormControl(null, Validators.required),
      'completed': new FormControl(null),
      'parentID': new FormControl('None')
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditTaskPage');
    this.date = new Date();
  }

  onSubmit(form: NgForm) {

    this.sqliteService.getEntryRowId(this.date).then((entryId: number) => {

      var completed: number = 0;
      console.log("taskParent value: " + form.value.taskParent);

      /*
      if(form.value.taskCompleted) {
        completed = 1;
      }
      else {
        completed = 0;
      }
      */

      if(entryId == -1) {
        //no entryid was returned
        console.log("No Entryid was found.");
        this.sqliteService.addEntry(this.date).then((entryId: number) => {
          this.sqliteService.addTask(new Task(null, form.value.taskName, form.value.taskDesc, completed, 0, -1, entryId, null))
            .then((task: Task) => {
              //this.sqliteService.tasks.push(task);
              form.reset();
              this.viewCtrl.dismiss(task);
            })
            .catch(e => {
              console.log(e);
            });
        })
        .catch(e => {
          console.log("Error: ");
          console.log(e);
        });
      }
      else {
        //entryid found
        console.log("Entryid Found.");
        this.sqliteService.getTasksByEntryId(entryId).then((tasks: Task[]) => {
          let maxPriority = 0;
          console.log(tasks.length);
          if(tasks.length > 0) {
            maxPriority = Math.max.apply(Math, tasks.map(function(o){ return o.priority }));
          }

          this.sqliteService.addTask(new Task(null, form.value.taskName, form.value.taskDesc, completed, maxPriority + 1, form.value.taskParent, entryId, null))
          .then((task: Task) => {
            //this.sqliteService.tasks.push(task);
            form.reset();
            this.viewCtrl.dismiss(task);
          })
          .catch(e => {
            console.log(e);
          });

        })
        .catch(e => {
          console.log("Error: ");
          console.log(e);
        });

      }
    })



  }

}
