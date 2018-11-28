import { DragulaService } from 'ng2-dragula';
import { CalendarViewPage } from './../calendar-view/calendar-view';
import { SqliteService } from './../../services/sqlite.service';
import { EditTaskPage } from './../edit-task/edit-task';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NavController, ModalController, FabContainer } from 'ionic-angular';
import { Task } from '../../models/task.model';
import * as anime from 'animejs';
import { Subscription } from 'rxjs';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit, OnDestroy {

  monthNames: string[] = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
  ];
  dayNames: string[] = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

  date: Date = new Date();
  todaysDate: Date = new Date();

  subs = new Subscription();
  dragulaName = "TASKS_DRAG";
  dragging: boolean = false;
  fab_edit_display: boolean = false;
  fab_delete_display: boolean = false;
  over_edit: boolean = false;
  over_delete: boolean = false;

  constructor(public navCtrl: NavController,
              public modalCtrl: ModalController,
              public sqliteService: SqliteService,
              private dragulaService: DragulaService) {

  }

  ngOnInit() {

    this.subs.add(this.dragulaService.drag(this.dragulaName)
      .subscribe(({ name, el, source }) => {
        console.log("Drag event for task initiated.");
        this.dragging = true;
        anime.remove("#delete_fab");
        anime.remove("#edit_fab");

        anime({
          targets: '#delete_fab',
          translateX: -100,
          rotate: -360,
          easing: 'easeOutElastic',
          elasticity: 300,
          duration: 500
        });

        anime({
          targets: '#edit_fab',
          translateX: -100,
          rotate: -360,
          easing: 'easeOutElastic',
          elasticity: 300,
          duration: 500
        });

      })
    );

    this.subs.add(this.dragulaService.dragend(this.dragulaName)
      .subscribe(({ name, el }) => {
        console.log("Drag ended.");
        this.dragging = false;
        anime.remove("#delete_fab");
        anime.remove("#edit_fab");
        anime({
          targets: '#delete_fab',
          translateX: 100,
          rotate: 360,
          easing: 'easeInElastic',
          elasticity: 300,
          duration: 500
        }).finished.then(() => {
          this.fab_delete_display = false;
        });

        anime({
          targets: '#edit_fab',
          translateX: 100,
          rotate: 360,
          easing: 'easeInElastic',
          elasticity: 300,
          duration: 500
        }).finished.then(() => {
          this.fab_edit_display = false;
        });
      })
    );

    this.subs.add(this.dragulaService.over(this.dragulaName)
      .subscribe(({ name, el, container, source }) => {
        //console.log("Hovering over:");
        //console.log(container);
        //console.log("Source: ");
        //console.log(source);
        if(container.id == "edit_task") {
          console.log("Hovering over edit_task");

          this.fab_edit_display = true;
          this.animateHover(1.2, 800, 400, "#edit_fab");
          this.over_edit = true;
        }
        if(container.id == "delete_task") {
          console.log("Hovering over delete_task");

          this.fab_delete_display = true;
          this.animateHover(1.2, 800, 400, "#delete_fab");
          this.over_delete = true;
        }
      })
    );

    this.subs.add(this.dragulaService.out(this.dragulaName)
      .subscribe(({ name, el, container, source }) => {
        if(container.id == "edit_task") {
          console.log("Leaving edit_task");
          this.animateHover(1, 600, 300, "#edit_fab");
          this.over_edit = false;
        }
        if(container.id == "delete_task") {
          console.log("Leaving delete_task");
          this.animateHover(1, 600, 300, "#delete_fab");
          this.over_delete = false;
        }
      })
    );

    this.subs.add(this.dragulaService.drop(this.dragulaName)
      .subscribe(({ name, el, target, source, sibling }) => {
        /*
        console.log("Drop event initiated.");
        console.log("target: ");
        console.log(target);
        console.log("Source: ");
        console.log(source);
        console.log("Element: ");
        console.log(el);
        console.log("Substring: ");
        console.log(el.id.substring(5));
        */
        let taskRowId: number = Number(el.id.substring(5)); //draggable task id = "task_" + rowid, we just want the rowid.
        let taskIndex: number = this.sqliteService.tasks.findIndex(item => item.rowid == taskRowId);

        if(target.id == "edit_task" && this.over_edit) {
          this.editTask(this.sqliteService.tasks[taskIndex]);
          this.dragulaService.find(this.dragulaName).drake.cancel(true);
        }
        else if(target.id == "delete_task" && this.over_delete) {
          this.deleteTask(this.sqliteService.tasks[taskIndex].rowid);
        }
        else {
          this.dragulaService.find(this.dragulaName).drake.cancel(true);
        }

      })
    );

  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subs.unsubscribe();
  }

  animateHover(scale: number, duration: number, elasticity: number, el: string) {
    anime.remove(el);
    anime({
      targets: el,
      scale: scale,
      duration: duration,
      elasticity: elasticity
    });
  }

  ionViewDidLoad() {
    console.log('[home.ts] Entering ionViewDidLoad() --------------');
    this.todaysDate = new Date();
    this.date = new Date();
    //this.sqliteService.createAllTables();
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

    /*
    presentEditTask.onDidDismiss(data => {
      if(data instanceof Task) {

      }
    });
    */

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
