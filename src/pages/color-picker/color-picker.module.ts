import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ColorPickerPage } from './color-picker';

@NgModule({
  declarations: [
    ColorPickerPage,
  ],
  imports: [
    IonicPageModule.forChild(ColorPickerPage),
  ],
})
export class ColorPickerPageModule {}
