import { EditGoalModalPage } from './../pages/edit-goal-modal/edit-goal-modal';
import { ColorPickerPage } from './../pages/color-picker/color-picker';
import { CalendarPopoverPage } from './../pages/calendar-popover/calendar-popover';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { SQLite } from '@ionic-native/sqlite';
import { Toast } from '@ionic-native/toast';
import { DatePicker } from '@ionic-native/date-picker';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { EditTaskPage } from '../pages/edit-task/edit-task';
import { CalendarViewPage } from './../pages/calendar-view/calendar-view';

import { SqliteService } from './../services/sqlite.service';
import { IconPickerPage } from '../pages/icon-picker/icon-picker';
import { DragulaModule, DragulaService } from 'ng2-dragula';
import { EditGoalPage } from '../pages/edit-goal/edit-goal';
import { ChartsModule } from 'ng2-charts';
import { ChartActivityPage } from '../pages/chart-activity/chart-activity';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    EditTaskPage,
    CalendarViewPage,
    CalendarPopoverPage,
    ColorPickerPage,
    IconPickerPage,
    EditGoalPage,
    ChartActivityPage,
    EditGoalModalPage
  ],
  imports: [
    BrowserModule,
    ChartsModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    DragulaModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    EditTaskPage,
    CalendarViewPage,
    CalendarPopoverPage,
    ColorPickerPage,
    IconPickerPage,
    EditGoalPage,
    ChartActivityPage,
    EditGoalModalPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SQLite,
    Toast,
    SqliteService,
    DatePicker,
    DragulaService
  ]
})
export class AppModule {}


