import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-icon-picker',
  templateUrl: 'icon-picker.html',
})
export class IconPickerPage implements OnInit{

  iconPicked: string = "";
  iconList: string[] = ["alarm", "alert", "analytics", "aperture", "basket", "battery-charging", "beaker", "beer", "bicycle", "book", "brush", "build", "cafe", "calculator", "call", "camera", "car", "cart", "cash", "chatbubbles", "construct", "flask", "game-controller-b", "heart", "help-circle", "key", "mail", "nutrition", "paper", "plane", "pulse", "ribbon", "school", "stats", "subway" ];

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  ngOnInit() {

    if(this.navParams.get('icon') != null) {
      this.iconPicked = this.navParams.get('icon');
    }
    else {
      this.iconPicked = this.iconList[0];
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IconPickerPage');
  }

  changeIcon(icon: string) {
    this.iconPicked = icon;
    this.viewCtrl.dismiss(icon);
  }

}
