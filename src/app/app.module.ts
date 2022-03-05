import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { WebChatModule } from './web-chat/web-chat.module';

import { ThemeModule } from './theme/theme.module';
import { lightTheme } from './theme/light-theme';
import { darkTheme } from './theme/dark-theme';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SearchPageComponent } from './search-page/search-page.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import {SearchPipe} from './pipes/search.pipe';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { GuestUserComponent } from './guest-user/guest-user.component';
import { ChatPageComponent } from './chat-page/chat-page.component'
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
// const url = 'http://localhost:4000';
const url = 'http://18.191.97.1:4000';
const config: SocketIoConfig = { url: url, options: {} };

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    LoginComponent,
    SignupComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    SearchPageComponent,
    HeaderComponent,
    FooterComponent,
    SearchPipe,
    GuestUserComponent,
    ChatPageComponent
  ],
  exports: [
    /* then export it */
    SearchPipe
  ],
  imports: [
    BrowserModule,
    ThemeModule.forRoot({
      themes: [lightTheme, darkTheme],
      active: 'light'
    }),
    BrowserAnimationsModule,
    AppRoutingModule,
    WebChatModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    ToastrModule.forRoot(),
    SocketIoModule.forRoot(config),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy },],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}