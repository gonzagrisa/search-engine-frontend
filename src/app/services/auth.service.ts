import { Injectable } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';
import { IUser } from '../api/models/i-user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  token: string;
  private role = new BehaviorSubject(null);
  role$ = this.role.asObservable();

  constructor() {
    console.log("ASDASD")
    if (this.getToken()){
      this.role.next(this.getUserToken().role);
    } else{
      this.role.next(null); 
    }
  }

  setToken(token: string){
    localStorage.setItem('token', token);
    this.role.next(this.getUserToken().role);
  }
  
  getToken(){
    return localStorage.getItem('token');
  }

  isLoggedIn(){
    return this.getToken() != null;
  }

  isAdmin(){
    if (this.isLoggedIn())
      return this.getUserToken().role === "ADMIN";
    return false;
  }

  getDecodedToken(){
    return jwtDecode(this.getToken());
  }

  getUserToken(): IUser{
    let decoded = jwtDecode(this.getToken());
    let user: IUser = {
      user_id: decoded['id'],
      username: decoded['username'],
      role: decoded['role']
    }
    return user;
  }

  isImpresonator(){
    if (this.isLoggedIn()){
      return this.getDecodedToken()['impersonator'] != null
    }
    return false;
  }

  deleteToken(){
    localStorage.removeItem('token');
    this.role.next(null);
  }
}
