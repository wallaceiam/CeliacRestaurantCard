import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';

import { availableLanguages } from './i18n.constants';

@Component({
    selector: 'languages',
    templateUrl: 'languages.html'
})

export class LanguagesPage implements OnInit {

    private allLanguages;
    private selectedLanguage;
    private orgSelectedLanguage;

    private searchText: string = '';

    constructor(public navCtrl: NavController, private navParams: NavParams, private events: Events) {
        this.allLanguages = availableLanguages.sort((a, b) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        });

        this.selectedLanguage = this.navParams.get('language');
        this.orgSelectedLanguage = this.navParams.get('language');
        this.searchText = '';
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