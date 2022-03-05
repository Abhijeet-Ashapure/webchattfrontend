import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ThemeService } from '../theme/theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  userId = sessionStorage.getItem('user_id') ? sessionStorage.getItem('user_id') : localStorage.getItem('user_id');
  title = 'web-chat';
  userType = sessionStorage.getItem('userType');
  userNumber = sessionStorage.getItem('userNumber') ? sessionStorage.getItem('userNumber') : '';
  email = sessionStorage.getItem('email') ? sessionStorage.getItem('email') : '';
  constructor(private themeService: ThemeService,
    public translate: TranslateService,
    private router: Router,
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
    const active = this.themeService.getActiveTheme();
    if (active.name === 'light') {
      this.themeService.setTheme('dark');
      $("#main").addClass("darkTheme");

    } else {
      this.themeService.setTheme('light');
      $("#main").removeClass("darkTheme");
    }
  }

  search() {
    // if (this.userId) {
    this.router.navigate(['SearchPage']);
    // } else {
    //   if (sessionStorage.getItem('user_id')) {
    //     this.router.navigate(['guest-user']);
    //   } else {
    //     this.router.navigate(['Login']);
    //   }
    // }
  }

  logout() {
    sessionStorage.clear();
    localStorage.clear();
    this.router.navigate(['/'])
  }

}
