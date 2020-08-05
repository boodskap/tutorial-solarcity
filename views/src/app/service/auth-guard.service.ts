import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(public router: Router) { }

  canActivate(): boolean {
    const token = localStorage.getItem('user');
    if (token) {
      // if (this.router.url ==  "/auth/signin") {
      //   this.router.navigateByUrl("/dashboard")
      // }
      return true
    } else {
      this.router.navigateByUrl("/auth")
      return false
    }
  }
}
