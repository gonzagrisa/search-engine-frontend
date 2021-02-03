import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { faCheck, faUserEdit, faUserPlus, faUserSlash, faWindowClose } from '@fortawesome/free-solid-svg-icons';
import { IUser } from 'src/app/api/models/i-user';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

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
 
   searchTerm = "";
   usernameValid = true;

  constructor() { }

  ngOnInit(): void {
  }

}
