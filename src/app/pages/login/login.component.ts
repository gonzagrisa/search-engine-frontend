import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserResourceService } from 'src/app/api/resources/user-resource.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder,
              private api: UserResourceService, 
              private router: Router,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  login(): void{
    this.api.login(this.form.value).subscribe((token) => {
      this.authService.setToken(token);
      this.router.navigate(['dashboard']);
    })
  }

  get username(){
    return this.form.get('username');
  }

  get password(){
    return this.form.get('password');
  }

}
