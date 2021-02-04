import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserResourceService } from 'src/app/api/resources/user-resource.service';
import { UserValidators } from 'src/app/core/validators/user-validators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  form: FormGroup;

  constructor(private fb: FormBuilder,
              private api: UserResourceService,
              private router: Router,
              private userValidator: UserValidators) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', [Validators.required], [this.userValidator.username().bind(this)]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      password: ['', [Validators.required]],
      passwordConfirm: ['', [Validators.required]]
    });
  }

  signup(): void {
    this.api.signup(this.form.value).subscribe(
      () => {
        Swal.fire({
          title: 'Cuenta creada con éxito',
          showConfirmButton: false,
          icon: 'success',
          timer: 2000
        }).then(() => this.router.navigate(['login']));
      }
    );
  }

  passwordMatch(): boolean {
    return this.password.value === this.passwordConfirm.value;
  }

  get username(): AbstractControl {
    return this.form.get('username');
  }

  get firstName(): AbstractControl {
    return this.form.get('firstName');
  }

  get lastName(): AbstractControl {
    return this.form.get('lastName');
  }

  get password(): AbstractControl {
    return this.form.get('password');
  }

  get passwordConfirm(): AbstractControl {
    return this.form.get('passwordConfirm');
  }
}
