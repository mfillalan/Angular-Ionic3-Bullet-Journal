import { Goal } from './../../models/goal.model';
import { SqliteService } from './../../services/sqlite.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Renderer } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the EditGoalModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-goal-modal',
  templateUrl: 'edit-goal-modal.html',
})
export class EditGoalModalPage implements OnInit {

  mode: string = "new";
  button_str: string = "Add Goal";
  editGoal: Goal;

  goalForm: FormGroup;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public sqliteService: SqliteService,
              private formBuilder: FormBuilder,
              public renderer: Renderer,
              public viewCtrl: ViewController) {
    this.renderer.setElementClass(viewCtrl.pageRef().nativeElement, 'my-popup', true);
  }

  ngOnInit() {
    this.initializeForm();
    this.mode = this.navParams.get('mode');

    this.button_str = this.mode == "new" ? "Add Goal" : "Update Goal";

    if(this.mode == "edit") {
      this.editGoal = this.navParams.get('goal');
      this.goalForm.controls["name"].setValue(this.editGoal.name);
      this.goalForm.controls["desc"].setValue(this.editGoal.desc);
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditGoalModalPage');
  }

  private initializeForm() {
    this.goalForm = this.formBuilder.group({
      'name': ['', Validators.required],
      'desc': ['']
    });
  }

  onSubmit() {
    const value = this.goalForm.value;
    if(this.mode == "new") {
      this.sqliteService.addGoal(new Goal(null, value.name, value.desc, 0))
      .then((goal: Goal) => {
        this.sqliteService.goals.push(goal);

        console.log("Goal added with rowid: " + goal.rowid);
        this.viewCtrl.dismiss("new");
      });
    }
    if(this.mode == "edit") {
      this.editGoal.name = this.goalForm.value.name;
      this.editGoal.desc = this.goalForm.value.desc;

      this.sqliteService.updateGoal(this.editGoal)
      .then((goal: Goal) => {
        var index = this.sqliteService.goals.findIndex(item => item.rowid == goal.rowid);
        this.sqliteService.goals[index] = goal;
        this.viewCtrl.dismiss("edit");
      });

    }

  }

}
