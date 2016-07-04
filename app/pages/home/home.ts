import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
  constructor(private navController: NavController, private http: Http) {
    // this.http.get(this.config.api).map(res => res.json()).subscribe(data => console.log(data));
  }
}
