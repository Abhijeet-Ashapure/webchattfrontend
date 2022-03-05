import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
@Injectable(
  { providedIn: 'root' }
)
export class AuthGuardService implements CanActivate {
  constructor(public auth: AuthService, public router: Router) { }
  canActivate(): boolean {
    let token = this.auth.isAuthenticated();
    let currentRoute = this.router.url;
    console.log(token);
    console.log(currentRoute);
    if (!token) {
      this.router.navigate(['/Login']);  
      console.log('token not found')
      return false;
    } else if (currentRoute == '' || currentRoute == 'Login' || currentRoute == '/') {
      console.log('after login')
      this.router.navigate(['/Web-Chat']);
      return true;
    } else {
      console.log('else condition-- mean token is there')
      return true;
    }
  }
}