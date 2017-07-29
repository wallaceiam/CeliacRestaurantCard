import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';


import { availableLanguages, sysOptions } from './i18n.constants';
import { TranslateService } from 'ng2-translate';

import { LanguagesPage } from './languages';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  languages = availableLanguages;
	selectedLanguage = sysOptions.systemLanguage;

  constructor(public navCtrl: NavController, private events: Events, private translate: TranslateService) {
    this.applyLanguage();

    this.events.subscribe('language:changed',
    l => {
      this.selectedLanguage = l;
      this.applyLanguage();
    });
  }

  applyLanguage() {
    console.log('Using: ' + this.selectedLanguage);
		this.translate.use(this.selectedLanguage);
  }
  
  selectLanguage() {
    this.navCtrl.push(LanguagesPage, { language: this.selectedLanguage })
      .then((v) => { console.log('Pushed'); })
      .catch(e => { console.error(e); })
  }

}
