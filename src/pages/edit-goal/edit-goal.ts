import { Toast } from '@ionic-native/toast';
import { SqliteService } from './../../services/sqlite.service';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ItemSliding } from 'ionic-angular';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { Goal } from '../../models/goal.model';
import { EditGoalModalPage } from '../edit-goal-modal/edit-goal-modal';

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
              public toast: Toast,
              private formBuilder: FormBuilder,
              private modalCtrl: ModalController) {
  }

  ngOnInit() {
    console.log('ngOnInit() EditGoalPage');
    this.initializeForm();
  }

  private initializeForm() {
    this.goalForm = this.formBuilder.group({
      'name': ['', Validators.required],
      'desc': ['']
    });
  }

  newGoalPrompt() {
    let presentGoalPrompt = this.modalCtrl.create(EditGoalModalPage, {mode: 'new'});
    presentGoalPrompt.onDidDismiss(data => {
      if(data == null) {
        console.log("Null returned");
      }
      else if(data == "new") {
        this.toast.show("New Goal added!", '1000', 'bottom').subscribe(
          toast => {
            console.log(toast);
          }
        );
      }

    });
    presentGoalPrompt.present();
  }

  editGoalPrompt(goal: Goal, slidingItem: ItemSliding) {
    slidingItem.close();
    let presentGoalPrompt = this.modalCtrl.create(EditGoalModalPage, {mode: 'edit', goal: goal});
    presentGoalPrompt.present();
  }

  deleteGoal(rowid: number, slidingItem: ItemSliding) {
    slidingItem.close();
    this.sqliteService.deleteGoal(rowid).then((id: number) => {
      var index = this.sqliteService.goals.findIndex(item => item.rowid == id);
      this.sqliteService.goals.splice(index, 1);
      this.toast.show("Goal Deleted.", '1000', 'bottom').subscribe(
        toast => {
          console.log(toast);
        }
      );
    })
    .catch(e => {
      console.log(e);
    });
  }

}
