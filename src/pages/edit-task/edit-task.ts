import { IconPickerPage } from './../icon-picker/icon-picker';
import { SqliteService } from './../../services/sqlite.service';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavParams, ViewController, NavController, PopoverController, ModalController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { Task } from '../../models/task.model';
import { ColorPickerPage } from '../color-picker/color-picker';
import { EditGoalPage } from '../edit-goal/edit-goal';
//import * as anime from 'animejs';

@IonicPage()
@Component({
  selector: 'page-edit-task',
  templateUrl: 'edit-task.html',
})
export class EditTaskPage implements OnInit {

  //navParams {mode, task}
  mode: string = "New"; //"New" or "Edit"
  task: Task;
  tasksWithNoParent: Task[] = this.sqliteService.tasks.slice();
  iconList: string[] = ["alarm", "alert", "analytics", "aperture", "basket", "battery-charging", "beaker", "beer", "bicycle", "book", "brush", "build", "cafe", "calculator", "call", "camera", "car", "cart", "cash", "chatbubbles", "construct", "flask", "game-controller-b", "heart", "help-circle", "key", "mail", "nutrition", "paper", "plane", "pulse", "ribbon", "school", "stats", "subway" ];
  colorList: string[] = ["#cecece", "#65bc51", "#9abc51", "#417cdb", "#e9ed15", "#ffa323", "#dd2e2e", "#c936d1"];

  task_name: string = "";
  task_desc: string = "";
  task_completed: boolean = false;
  task_parentId: number = -1;
  task_icon: string = "";
  task_color: string = "";
  task_goalId: number = -1;
  submit_text: string;

  date: Date = new Date();

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public sqliteService: SqliteService,
              public popoverCtrl: PopoverController,
              public modalCtrl: ModalController) {
  }

  ngOnInit() {
    this.mode = this.navParams.get('mode');

    this.submit_text = this.mode == "New" ? "Add Task" : "Update";

    let tempTasks: Task[] = this.tasksWithNoParent.slice();
    for(let i = 0; i < this.tasksWithNoParent.length; i++) {
      if(this.tasksWithNoParent[i].parent_Task_id != -1) {
        let index = tempTasks.findIndex(item => item.rowid == this.tasksWithNoParent[i].rowid);
        tempTasks.splice(index, 1);
      }
    }
    this.tasksWithNoParent = tempTasks;

    if(this.mode == "Edit") {
      this.task = this.navParams.get('task');
      this.task_name = this.task.name;
      //this.task_desc = this.task.desc;
      this.task_completed = (this.task.completed == 1 ? true : false);
      this.task_parentId = this.task.parent_Task_id;
      this.task_icon = this.task.icon;
      this.task_color = this.task.color;
      this.task_goalId = this.task.Goal_id;
    }
    else {
      this.task_parentId = -1;
      this.task_icon = this.iconList[8]; //bicycle
      this.task_color = this.colorList[0];
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditTaskPage');
    this.date = new Date();
  }

  presentColorPopover(myEvent) {
    let popover = this.popoverCtrl.create(ColorPickerPage, {color: this.task_color});

    popover.onWillDismiss(data => {
      console.log(data);
      if(data != null) {
        this.task_color = data;
      }
    });

    popover.present({
      ev: myEvent
    });


  }

  presentIconPopover(myEvent) {
    let popover = this.popoverCtrl.create(IconPickerPage, {icon: this.task_icon});

    popover.onWillDismiss(data => {
      console.log(data);
      if(data != null) {
        this.task_icon = data;
      }
    });

    popover.present({
      ev: myEvent
    });
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  editGoals() {
    this.navCtrl.push(EditGoalPage);
    /*
    let presentGoalPage = this.modalCtrl.create(EditGoalPage);

    presentGoalPage.present();
    */
  }

  onSubmit(form: NgForm) {

    if(this.mode == "New") {

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
            this.sqliteService.addTask(new Task(null, form.value.taskName, "test", completed, 0, -1, entryId, null, form.value.taskIcon, form.value.taskColor))
              .then((task: Task) => {
                //this.sqliteService.tasks.push(task);
                form.reset();
                this.sqliteService.tasks.push(task);
                this.sqliteService.sortTasks();
                //this.navCtrl.pop();
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

            this.sqliteService.addTask(new Task(null, form.value.taskName, "test", completed, maxPriority + 1, form.value.taskParent, entryId, null, form.value.taskIcon, form.value.taskColor))
            .then((task: Task) => {
              //this.sqliteService.tasks.push(task);
              form.reset();

              this.sqliteService.tasks.push(task);
              this.sqliteService.sortTasks();
              //this.navCtrl.pop();
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
      .catch(e => {
        console.log(e);
      });

    }
    else if(this.mode == "Edit") {
      this.task.name = form.value.taskName;
      //this.task.desc = form.value.taskDesc;
      this.task.parent_Task_id = form.value.taskParent;

      this.sqliteService.updateTask(this.task).then((task: Task) => {
        let index = this.sqliteService.tasks.findIndex(item => item.rowid == task.rowid);
        this.sqliteService.tasks[index] = task;
        this.sqliteService.sortTasks();
        form.reset();
        //this.viewCtrl.dismiss();
        this.navCtrl.pop();
      });

    }

  }

}
