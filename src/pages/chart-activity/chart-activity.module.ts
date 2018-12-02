import { ChartsModule } from 'ng2-charts';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChartActivityPage } from './chart-activity';

@NgModule({
  declarations: [
    ChartActivityPage,
  ],
  imports: [
    IonicPageModule.forChild(ChartActivityPage),
    ChartsModule
  ],
})
export class ChartActivityPageModule {}
