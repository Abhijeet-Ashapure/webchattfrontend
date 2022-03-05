import { Component, OnInit } from '@angular/core';
import { ThemeService } from './theme/theme.service';
import { TranslateService } from '@ngx-translate/core';
import * as $ from 'jquery'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'web-chat';
  constructor(
    private themeService: ThemeService,
    //private uiStyleToggleService: UiStyleToggleService
    public translate: TranslateService
    ) { 
      translate.addLangs(['en', 'hi']);
      translate.setDefaultLang('en');
    }

  ngOnInit(): void {
  }

  switchLang(lang: string) {
    this.translate.use(lang);
  }

  toggle() {
    const active = this.themeService.getActiveTheme() ;
    if (active.name === 'light') {
      this.themeService.setTheme('dark');
      $("#main").addClass("darkTheme");

    } else {
      this.themeService.setTheme('light');
      $("#main").removeClass("darkTheme");
    }
  }
}
