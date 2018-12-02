import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditGoalModalPage } from './edit-goal-modal';

@NgModule({
  declarations: [
    EditGoalModalPage,
  ],
  imports: [
    IonicPageModule.forChild(EditGoalModalPage),
  ],
})
export class EditGoalModalPageModule {}
