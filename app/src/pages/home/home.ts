import { Component } from '@angular/core';
import { NavController, Events, ActionSheetController } from 'ionic-angular';

import { availableLanguages, sysOptions } from './i18n.constants';
import { TranslateService } from 'ng2-translate';

import { LanguagesPage } from './languages';
import { WhatICantEatPage } from './whaticanteat';
import { WhatICanEatPage } from './whaticaneat';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  languages = availableLanguages;
  selectedLanguage = sysOptions.systemLanguage;

  recentLanguageButtons: any[] = undefined;

  constructor(public navCtrl: NavController, public actionSheetCtrl: ActionSheetController, 
    private events: Events, private translate: TranslateService) {

    this.applyLanguage();

    this.events.subscribe('language:changed',
      l => {
        this.selectedLanguage = l;
        this.applyLanguage();
      });

    this.events.subscribe('recentLanguages:updated', r => { this.updateRecentLanguages(r); });
  }

  applyLanguage() {
    console.log('Using: ' + this.selectedLanguage);
    this.translate.use(this.selectedLanguage);
  }

  selectLanguage() {
    console.log(this.recentLanguageButtons);
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Recent Languages',
      buttons: this.recentLanguageButtons
    });
    actionSheet.present();
  }

  updateRecentLanguages(recentLanguages: any[]) {
    this.recentLanguageButtons = undefined;

    if (recentLanguages && recentLanguages instanceof Array) {
      let buttons = recentLanguages.reduce((prev, cur) => {
        prev.push({
          text: availableLanguages.find(l => l.code === cur).name,
          handler: () => {
            this.events.publish('language:changed', cur);
          }
        });
        return prev;
      }, []);
      buttons.push({
        text: 'All Languages',
        handler: () => {
          this.navCtrl.push(LanguagesPage, { language: this.selectedLanguage })
            .then((v) => { console.log('Pushed'); })
            .catch(e => { console.error(e); });
        }
      });
      buttons.push({
        text: 'Cancel',
        role: 'cancel',
        handler: () => { }
      });

      this.recentLanguageButtons = buttons;
    }
  }

  showWhatICantEat() {
    this.navCtrl.push(WhatICantEatPage, { language: this.selectedLanguage }, { animate: true, direction: 'forward' })
      .then((v) => { console.log('Pushed'); })
      .catch(e => { console.error(e); })
  }

  showWhatICanEat() {
    this.navCtrl.push(WhatICanEatPage, { language: this.selectedLanguage }, { animate: true, direction: 'forward' })
      .then((v) => { console.log('Pushed'); })
      .catch(e => { console.error(e); })
  }

}
