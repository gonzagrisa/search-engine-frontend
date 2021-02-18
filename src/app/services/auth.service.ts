import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';
import { IUser } from '../api/models/i-user';
import { UserResourceService } from '../api/resources/user-resource.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  token: string;
  private role = new BehaviorSubject(null);
  role$ = this.role.asObservable();
  private username = new BehaviorSubject(null);
  username$ = this.username.asObservable();

  constructor(private api: UserResourceService, private router: Router) {
    if (this.getToken()){
      this.role.next(this.getUserToken().role);
    } else {
      this.role.next(null);
      this.username.next(null);
    }
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
    this.role.next(this.getUserToken().role);
  }

  getToken(): string {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return this.getToken() != null;
  }

  isAdmin(): boolean {
    if (this.isLoggedIn()) {
      return this.getUserToken().role === 'ADMIN';
    }
    return false;
  }

  getDecodedToken(): unknown{
    return jwtDecode(this.getToken());
  }

  getUserToken(): IUser {
    const decoded = jwtDecode(this.getToken());
    const user: IUser = {
      userId: decoded['id'],
      username: decoded['username'],
      role: decoded['role']
    };
    return user;
  }

  login(user: IUser): void {
    this.api.login(user).subscribe((token) => {
      this.setToken(token);
      this.router.navigate(['dashboard']);
    });
  }

  logOut(): void {
    this.deleteToken();
    this.router.navigate(['']);
  }

  isImpresonator(): boolean {
    if (this.isLoggedIn()){
      return this.getDecodedToken()['impersonator'] != null;
    }
    return false;
  }

  deleteToken(): void{
    localStorage.removeItem('token');
    this.role.next(null);
  }
}
