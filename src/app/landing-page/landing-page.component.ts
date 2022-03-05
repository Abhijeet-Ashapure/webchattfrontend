import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ThemeService } from '../theme/theme.service';
import { LocationStrategy } from '@angular/common';
// import { UiStyleToggleService } from '../service/ui-style-toggle.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  constructor(
    private themeService: ThemeService,
    public translate: TranslateService,
    private location: LocationStrategy
    //private uiStyleToggleService: UiStyleToggleService
  ) {
    translate.addLangs(['en', 'hi']);
    translate.setDefaultLang('en');
    history.pushState(null, '', window.location.href);
    this.location.onPopState(() => {
      history.pushState(null, '', window.location.href);
    });
  }

  ngOnInit(): void {
    localStorage.clear();
    sessionStorage.clear();
  }
  toggle() {
    const active = this.themeService.getActiveTheme();
    if (active.name === 'light') {
      this.themeService.setTheme('dark');
    } else {
      this.themeService.setTheme('light');
    }
  }

  // toggleTheme() {
  //   this.uiStyleToggleService.toggle();
  // }
}
