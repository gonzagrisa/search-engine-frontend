import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { faCheck, faEraser, faPen, faWindowClose } from '@fortawesome/free-solid-svg-icons';
import { IWebsite } from 'src/app/api/models/i-website';
import { WebsiteResourceService } from 'src/app/api/resources/website-resource.service';
import { UrlValidator } from 'src/app/core/validators/url-validator';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-websites',
  templateUrl: './websites.component.html',
  styleUrls: ['./websites.component.css']
})
export class WebsitesComponent implements OnInit {

  formRow: FormGroup;
  
  faPen = faPen;
  faDelete = faEraser;
  faCancel = faWindowClose;
  faUpdate = faCheck;
  
  editId: number;
  
  regex = new RegExp("^(http:\\/\\/www\\.|https:\\/\\/www\\.|http:\\/\\/|https:\\/\\/)[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*((\\.([a-z]{2,5}))(:[0-9]{1,5})?|(:[0-9]{1,5}))(\\/.*)?$");
  websites: IWebsite[];
  websitesPage: IWebsite[];
  page = 1;
  pageSize = 10;
  total: number;
  searchTerm = '';
  
  constructor(
    private route: ActivatedRoute,
    private api: WebsiteResourceService,
    private fb: FormBuilder,
    private urlValidator: UrlValidator) { }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.websites = data.websites;
    });
    this.refreshWebsites();
    this.formRow = this.fb.group({
      websiteId: [null],
      url: ['', [Validators.required, Validators.pattern(this.regex)], [this.urlValidator.unique('websiteId').bind(this), this.urlValidator.pingURL().bind(this)]]
    });
  }

  addWebsite(): void {
    this.api.addWebsite(this.formRow.value).subscribe(
      () => {
        this.updateListWebsites();
        Swal.fire({
          icon: 'success',
          title: 'Página Agregada con Éxito',
          showConfirmButton: false,
          timer: 1500
        });
      }
    )
  }

  reindex(website: IWebsite): void {
    this.api.reindex(null, null, { id: website.websiteId }).subscribe(
      () => {
        this.updateListWebsites();
        Swal.fire({
          icon: 'success',
          title: 'La página será reindexada en unos instantes',
          showConfirmButton: false,
          timer: 1500
        });
      }
    )
  }

  updateWebsite(website: IWebsite): void {
    this.api.updateWebsite({ websiteId: website.websiteId, url: this.url.value }).subscribe(
      () => {
        /* this.updateListWebsites();
        this.cancelEdit(); */
        Swal.fire({
          icon: 'success',
          title: 'Página Actualizada con Éxito',
          showConfirmButton: false,
          timer: 1500
        });
      }
    )
  }

  deleteWebsite(website: IWebsite): void {
    let url = website.url.startsWith('http://') ? website.url.split('http://')[1] : website.url.split('https://')[1];
    Swal.fire({
      title: `Estás Seguro de querer eliminar ${url}?`,
      text: 'Los datos indexados de la página se perderán',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.api.deleteWebsite({ websiteId: website.websiteId }).subscribe(
          () => {
            this.updateListWebsites();
            Swal.fire('Eliminada!', 'La Página ha sido eliminada', 'success');
          }
        );
      }
    });
  }

  private updateListWebsites(): void{
    this.api.getWebsites().subscribe(
      (res) => {
        this.websites = res;
        this.refreshWebsites();
        if (this.searchTerm !== ''){
          this.search();
        }
      }
    );
  }

  refreshWebsites(): void {
    this.websitesPage = this.websites
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    this.total = this.websites.length;
  }

  search(): void {
    this.websitesPage = this.websites.filter(user => this.matches(user, this.searchTerm));
    this.websitesPage = this.websitesPage.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    if (this.searchTerm === '') {
      this.total = this.websites.length;
    } else {
      this.total = this.websitesPage.length;
    }
  }

  private matches(website: IWebsite, term: string): boolean {
    term = term.toLocaleLowerCase();
    return website.url.toLowerCase().includes(term)
  }

  /* checkURL() {
    let regex = new RegExp("^(?![^\\n]*\\.$)(?:https?:\\/\\/)(?:(?:[2][1-4]\\d|25[1-5]|1\\d{2}|[1-9]\\d|[1-9])(?:\\.(?:[2][1-4]\\d|25[1-5]|1\\d{2}|[1-9]\\d|[0-9])){3}(?::\\d{4})?|[a-z\\-]+(?:\\.[a-z\\-]+){1,}).*");
    let value = this.url.value;
    console.log(regex.test(value))
  } */

  edit(website: IWebsite): void {
    this.editId = website.websiteId;
    this.websiteId.setValue(website.websiteId);
    this.url.setValue(website.url);
  }

  cancelEdit(): void {
    this.editId = null;
    this.formRow.reset();
  }
  
  get websiteId(): AbstractControl {
    return this.formRow.get('websiteId');
  }

  get url(): AbstractControl {
    return this.formRow.get('url');
  }
}


/*

import { Component } from '@angular/core'
import {FormBuilder, ControlContainer} from '@angular/forms'

@Component({
  selector: 'sub-form',
  template: `
    <ng-container [formGroup]="controlContainer.control">
      <input type=text formControlName=foo>
      <input type=text formControlName=bar>
    </ng-container>
  `,
})
export class SubFormComponent {
  constructor(public controlContainer: ControlContainer) {
  }
}

@Component({
  selector: 'my-app',
  template: `

      <sub-form [formGroup]=form></sub-form>
      <input type=text formControlName=baz>

    <pre>{{ form.value | json }}</pre>
  `,
})
export class AppComponent  {
  form = this.fb.group({
    foo: 'foo',
    bar: 'bar',
  })

  constructor(private fb: FormBuilder) {}
}
*/