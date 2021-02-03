import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {

  constructor (private authService: AuthService) {}

  canActivate(): boolean {
    if (this.authService.getToken() != null){
      return false;
    }
    return true;
  }
  
}
