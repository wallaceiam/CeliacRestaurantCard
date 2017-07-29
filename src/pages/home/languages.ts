import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';

import { availableLanguages } from './i18n.constants';

@Component({
    selector: 'languages',
    templateUrl: 'languages.html'
})

export class LanguagesPage implements OnInit {

    private allLanguages = availableLanguages;
    private selectedLanguage;
    private orgSelectedLanguage;
    
   constructor(public navCtrl: NavController, private navParams: NavParams, private events: Events) {
        this.selectedLanguage = this.navParams.get('language');
        this.orgSelectedLanguage = this.navParams.get('language');
        console.log('SELECTED LANG: ' + this.selectedLanguage);
   }

    ngOnInit() { }

    select(item) {
        this.selectedLanguage = item;
    }

    ionViewWillLeave() {
        if (this.selectedLanguage !== this.orgSelectedLanguage) {
            this.events.publish('language:changed', this.selectedLanguage);
        }
    }
}