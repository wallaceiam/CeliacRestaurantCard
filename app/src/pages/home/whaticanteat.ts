import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';


import { availableLanguages, sysOptions } from './i18n.constants';
import { TranslateService } from 'ng2-translate';

@Component({
    selector: 'page-whaticanteat',
    templateUrl: 'whaticanteat.html'
})
export class WhatICantEatPage {

    languages = availableLanguages;
    selectedLanguage = sysOptions.systemLanguage;

    constructor(public navCtrl: NavController, private navParams: NavParams, private events: Events, private translate: TranslateService) {
        
        this.selectedLanguage = this.navParams.get('language') ? 
            this.navParams.get('language') : sysOptions.systemLanguage;

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

}
