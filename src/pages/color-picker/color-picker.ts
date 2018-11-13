import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-color-picker',
  templateUrl: 'color-picker.html',
})
export class ColorPickerPage implements OnInit{

  colorPicked: string = "";
  colorList: string[] = ["#cecece", "#65bc51", "#9abc51", "#417cdb", "#e9ed15", "#ffa323", "#dd2e2e", "#c936d1"];

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  ngOnInit() {

    if(this.navParams.get('color') != null) {
      this.colorPicked = this.navParams.get('color');
    }
    else {
      this.colorPicked = this.colorList[0];
    }

    console.log(this.colorPicked);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ColorPickerPage');
  }

  changeColor(color: string) {
    this.colorPicked = color;
    this.viewCtrl.dismiss(color);
  }

}
