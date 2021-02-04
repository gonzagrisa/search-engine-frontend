import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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

  constructor(
    private route: ActivatedRoute,
    public authService: AuthService,
    private fb: FormBuilder,
    private api: UserResourceService,
    private userValidator: UserValidators) { }

  ngOnInit(): void {
    this.user = this.route.snapshot.data['user'];

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

  updateInfo() {
    this.api.updateInfo(this.newPassword.value).subscribe({
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

  updatePassword() {
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

  deleteAccount(){
    Swal.fire({
      title: 'Estás Seguro?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar cuenta!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Cuenta Eliminada 😢',
          'Un gusto haberte conocido ' + this.user.username,
          'success'
        )
      }
    })
  }

  passwordMatch() {
    return this.newPassword.value === this.newPasswordConfirm.value
  }

  get username() {
    return this.formData.get('username');
  }

  get firstName() {
    return this.formData.get('firstName');
  }

  get lastName() {
    return this.formData.get('lastName');
  }

  get oldPassword() {
    return this.formPassword.get('oldPassword');
  }

  get newPassword() {
    return this.formPassword.get('newPassword');
  }

  get newPasswordConfirm() {
    return this.formPassword.get('newPasswordConfirm');
  }
}
