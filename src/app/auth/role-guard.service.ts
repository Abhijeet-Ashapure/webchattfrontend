import { Injectable } from '@angular/core';
import {
    Router,
    CanActivate,
    ActivatedRouteSnapshot
} from '@angular/router';
import { AuthService } from './auth.service';
// import decode from 'jwt-decode';
@Injectable({ providedIn: 'root' })
export class RoleGuardService implements CanActivate {
    constructor(public auth: AuthService, public router: Router) { }
    canActivate(route: ActivatedRouteSnapshot): boolean {
        // this will be passed from the route config
        // on the data property
        const expectedRole = route.data.expectedRole;
        const token = localStorage.getItem('token');
        const userRole = localStorage.getItem('user_type');
        // decode the token to get its payload
        if (!this.auth.isAuthenticated()) {
            this.router.navigate(['/']);
            return false;
        }
        return true;
    }
}