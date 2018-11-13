import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IconPickerPage } from './icon-picker';

@NgModule({
  declarations: [
    IconPickerPage,
  ],
  imports: [
    IonicPageModule.forChild(IconPickerPage),
  ],
})
export class IconPickerPageModule {}
