import { Component } from '@angular/core';

import { ViewController, NavParams } from 'ionic-angular';

import { Researcher } from '../../models';

@Component({
  selector: 'researcher-contact',
  templateUrl: 'build/components/researcher-contact/template.html'
})
export class ResearcherContactComponent {
  public researcher: Researcher;

  constructor(
    private params: NavParams,
    private viewCtrl: ViewController
  ) {
    this.params.get('researcher$').subscribe(r => this.researcher = r);
  }

  close() {
   this.viewCtrl.dismiss();
  }

  get researcherName() {
    return `${this.researcher.first_name} ${this.researcher.last_name}`;
  }
}
