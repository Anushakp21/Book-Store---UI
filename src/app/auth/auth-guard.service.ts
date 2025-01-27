import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Route, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor( private router:Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const token = localStorage.getItem('token'); // Authentication check
    const role = localStorage.getItem('userRole');  // Role check

    // Check if user is authenticated
    if (!token) {
      this.router.navigate(['/login']); // Redirect unauthenticated users
      return false;
    }

    // Check role permissions
    const allowedRoles = route.data['roles'] as Array<string>;    
    if (allowedRoles && !allowedRoles.includes(role!)) {
      this.router.navigate(['/']); // Redirect unauthorized users
      return false;
    }

    return true; 
  }
}
