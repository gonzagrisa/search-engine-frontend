import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faCheck, faUserEdit, faUserPlus, faUserSlash, faWindowClose } from '@fortawesome/free-solid-svg-icons';
import { IUser } from 'src/app/api/models/i-user';
import { UserResourceService } from 'src/app/api/resources/user-resource.service';
import { UserValidators } from 'src/app/core/validators/user-validators';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  // ICONS
  faUserEdit = faUserEdit;
  faUserSlash = faUserSlash;
  faCancel = faWindowClose;
  faUpdate = faCheck;
  faNewUser = faUserPlus;

  formRow: FormGroup;

  users: IUser[];
  usersPage: IUser[];
  page = 1;
  pageSize = 10;
  total: number;
  editId: number;

  searchTerm = '';

  constructor(
    private api: UserResourceService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private userValidator: UserValidators) { }

  ngOnInit(): void {
    this.users = this.route.snapshot.data['users'];
    this.refreshUsers();
    this.formRow = this.fb.group({
      userId: [null],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      username: ['', [Validators.required], [this.userValidator.username('userId').bind(this)]],
      password: ['', [Validators.required]]
    });
  }

  refreshUsers(): void {
    this.usersPage = this.users
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    this.total = this.users.length;
  }

  search(): void {
    this.usersPage = this.users.filter(user => this.matches(user, this.searchTerm));
    this.usersPage = this.usersPage.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    if (this.searchTerm === '') {
      this.total = this.users.length;
    } else {
      this.total = this.usersPage.length;
    }
  }

  private matches(user: IUser, term: string): boolean {
    term = term.toLocaleLowerCase();
    return user.username.toLowerCase().includes(term)
      || user.firstName.toLocaleLowerCase().includes(term)
      || user.lastName.toLocaleLowerCase().includes(term);
  }

  impersonate(id: number): void {
    this.api.impersonate({id}).subscribe(
      (res) => {
        this.authService.setToken(res);
        this.router.navigate(['dashboard']);
      }
    );
  }

  edit(user: IUser): void {
    this.formRow.reset();
    this.editId = user.userId;
    this.userId.patchValue(user.userId);
    this.firstName.patchValue(user.firstName);
    this.lastName.patchValue(user.lastName);
    this.username.patchValue(user.username);
  }

  resetForm(): void {
    this.editId = null;
    this.formRow.reset();
  }

  private updateListUsers(): void{
    this.api.getUsers().subscribe(
      (res) => {
        this.users = res;
        this.refreshUsers();
        if (this.searchTerm !== ''){
          this.search();
        }
      }
    );
  }

  createAccount(): void {
    this.api.signup(this.formRow.value).subscribe(
      () => {
        Swal.fire('Cuenta Creada!', '', 'success');
        this.resetForm();
        this.updateListUsers();
      }
    );
  }

  updateUser(): void {
    console.log(this.userId.value);
    this.api.updateUser(this.formRow.value, null, { id: this.userId.value }).subscribe(
      () => {
        Swal.fire('Operación Exitosa', 'Usuario Actualizado', 'success');
        this.updateListUsers();
      }
    );
    this.resetForm();
  }

  deleteUser(user: IUser): void {
    Swal.fire({
      title: `Estás Seguro de querer eliminar a ${user.username}?`,
      text: 'El usuario perderá acceso a su cuenta',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.api.deleteUser({ id: user.userId }).subscribe(
          () => {
            Swal.fire('Eliminado!', 'El usuario ha sido eliminado', 'success');
            this.updateListUsers();
          }
        );
      }
    });
  }

  get userId(): AbstractControl {
    return this.formRow?.get('userId');
  }

  get firstName(): AbstractControl {
    return this.formRow?.get('firstName');
  }

  get lastName(): AbstractControl {
    return this.formRow?.get('lastName');
  }

  get username(): AbstractControl {
    return this.formRow?.get('username');
  }

  get password(): AbstractControl {
    return this.formRow?.get('password');
  }
}
