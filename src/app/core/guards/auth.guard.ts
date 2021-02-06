import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private route: Router, private authService: AuthService) { }

  canActivate(): boolean {
    if (this.authService.isLoggedIn()){
      return true;
    }
    this.route.navigate(['/login']);
    return false;
  }
}
