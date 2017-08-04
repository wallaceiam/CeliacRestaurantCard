import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { HomePage } from '../pages/home/home';
import { LanguagesPage } from '../pages/home/languages';

import { availableLanguages } from '../pages/home/i18n.constants';

export interface MenuItem { title: string, component: any, children: Array<MenuItem> };

const staticPages: Array<MenuItem> = [
  { title: 'Home', component: HomePage, children: null },
  { title: 'Change Language', component: LanguagesPage, children: null }];

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<MenuItem> = [];

  year: number = new Date().getFullYear();

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
    private storage: Storage, private events: Events) {

    this.initializeApp();

    this.updateMenu();

    this.events.subscribe('language:changed',
      l => {
        this.storage.get('recentLanguages').then(
          r => {
            if (r && r instanceof Array) {
              r = r.filter(lang => lang !== l);
              r.splice(0, 0, l);
            } else {
              r = [l];
            }

            if (r.length > 5) {
              r = r.slice(0, 5);
            }

            this.storage.set('recentLanguages', r).then(
              v => {
                this.events.publish('recentLanguages:updated', r);
              });
          }
        );
      }
    );

    this.events.subscribe('recentLanguages:updated', () => { this.updateMenu(); });

    this.storage.get('recentLanguages').then(
      rl => {
        this.events.publish('recentLanguages:updated', rl);
      });

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if (!page.component) {
      return;
    }
    if (typeof (page.component) !== 'string') {
      this.nav.setRoot(page.component);
    } else {
      this.events.publish('language:changed', page.component);
    }
  }

  updateMenu() {
    this.pages = [];
    staticPages.forEach(sp => {
      this.pages.push(sp);
    })
    this.storage.get('recentLanguages').then(
      r => {
        if (r && r instanceof Array) {
          let recent: Array<MenuItem> = [];
          r.forEach(l => {
            let name = availableLanguages.find(av => av.code == l).name;
            recent.push({ title: name, component: l, children: null });
          });
          if (recent.length > 0) {
            this.pages.push({ title: 'Recent', component: null, children: recent });
          }
        }
      });
  }
}
