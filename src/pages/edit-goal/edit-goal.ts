import { Toast } from '@ionic-native/toast';
import { SqliteService } from './../../services/sqlite.service';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Goal } from '../../models/goal.model';

/**
 * Generated class for the EditGoalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-goal',
  templateUrl: 'edit-goal.html',
})
export class EditGoalPage implements OnInit{

  mode: string = "new";
  button_str: string = "Add Goal";

  goalForm: FormGroup;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public sqliteService: SqliteService,
              public toast: Toast) {
  }

  ngOnInit() {
    console.log('ngOnInit() EditGoalPage');
    this.initializeForm();
  }

  private initializeForm() {
    this.goalForm = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'desc': new FormControl(null)
    });
  }

  onSubmit() {
    const value = this.goalForm.value;
    this.sqliteService.addGoal(new Goal(null, value.name, value.desc, 0))
    .then((goal: Goal) => {
      this.sqliteService.goals.push(goal);
      console.log("Goal added with rowid: " + goal.rowid);
      this.toast.show("New Goal added!", '1000', 'bottom');
    });
  }

}
