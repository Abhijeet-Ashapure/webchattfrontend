import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './auth/auth-guard.service';
import { ChatPageComponent } from './chat-page/chat-page.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { GuestUserComponent } from './guest-user/guest-user.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SearchPageComponent } from './search-page/search-page.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/Landing-Page',
    pathMatch: 'full'
  },
  { path: 'Landing-Page', component: LandingPageComponent },
  { path: 'Login', component: LoginComponent },
  { path: 'Signup', component: SignupComponent },
  { path: 'guest-user',component:GuestUserComponent},
  { path: 'ForgotPassword', component: ForgotPasswordComponent },
  { path: 'ResetPassword/:id', component: ResetPasswordComponent },
  { path: 'SearchPage', component: SearchPageComponent },
  { path: 'ChatPage', component: ChatPageComponent},
  { path: 'Web-Chat', loadChildren: () => import('./web-chat/web-chat-routing.module').then(m => m.WebChatRoutingModule)},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
