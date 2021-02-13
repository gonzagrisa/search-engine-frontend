import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { IUser } from 'src/app/api/models/i-user';
import { UserResourceService } from 'src/app/api/resources/user-resource.service';
import { UserValidators } from 'src/app/core/validators/user-validators';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  formData: FormGroup;
  formPassword: FormGroup;
  user: IUser;

  RESOLVER_FIELD = 'user';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    private fb: FormBuilder,
    private api: UserResourceService,
    private userValidator: UserValidators) { }

  ngOnInit(): void {
    this.user = this.route.snapshot.data[this.RESOLVER_FIELD];

    this.formData = this.fb.group({
      username: [this.user.username, [Validators.required], [this.userValidator.username(null, this.user.userId).bind(this)]],
      firstName: [this.user.firstName, [Validators.required]],
      lastName: [this.user.lastName, [Validators.required]],
    });

    this.formPassword = this.fb.group({
      oldPassword: ['', [Validators.required], [this.userValidator.password(null, this.user.userId).bind(this)]],
      newPassword: ['', [Validators.required]],
      newPasswordConfirm: ['', [Validators.required]]
    });
  }

  updateInfo(): void {
    this.api.updateInfo(this.formData.value).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Información Actualizada',
          showConfirmButton: false,
          timer: 1500
        });
      }
    });
  }

  updatePassword(): void {
    this.api.updatePassword({password: this.newPassword.value}).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Contraseña Actualizada',
          showConfirmButton: false,
          timer: 1500
        });
        this.formPassword.reset();
      }
    });
  }

  deleteAccount(): void{
    Swal.fire({
      title: 'Estás Seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar cuenta!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.api.deleteOwnUser().subscribe({
          next: () => {
            Swal.fire(
              'Cuenta Eliminada 😢',
              'Un gusto haberte conocido ' + this.user.username,
              'success'
            );
            this.router.navigate(['']);
          }
        });
      }
    });
  }

  passwordMatch(): boolean {
    return this.newPassword.value === this.newPasswordConfirm.value;
  }

  get username(): AbstractControl {
    return this.formData.get('username');
  }

  get firstName(): AbstractControl {
    return this.formData.get('firstName');
  }

  get lastName(): AbstractControl {
    return this.formData.get('lastName');
  }

  get oldPassword(): AbstractControl {
    return this.formPassword.get('oldPassword');
  }

  get newPassword(): AbstractControl {
    return this.formPassword.get('newPassword');
  }

  get newPasswordConfirm(): AbstractControl {
    return this.formPassword.get('newPasswordConfirm');
  }
}
