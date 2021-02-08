import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { faCheck, faEraser, faPen, faPlus, faWindowClose } from '@fortawesome/free-solid-svg-icons';
import { IService } from 'src/app/api/models/i-service';
import { ServicesResourceService } from 'src/app/api/resources/services-resource.service';
import { UrlValidator } from 'src/app/core/validators/url-validator';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {

  formRow: FormGroup;
  editId: number;

  faPen = faPen;
  faDelete = faEraser;
  faCancel = faWindowClose;
  faUpdate = faCheck;
  faPlus = faPlus;

  regex = new RegExp("^(?![^\\n]*\\.$)(?:https?:\\/\\/)(?:(?:[2][1-4]\\d|25[1-5]|1\\d{2}|[1-9]\\d|[1-9])(?:\\.(?:[2][1-4]\\d|25[1-5]|1\\d{2}|[1-9]\\d|[0-9])){3}(?::\\d{4})?|localhost(?::\\d{4})?|[a-z\\-]+(?:\\.[a-z\\\-]+){1,}).*");
  services: IService[];
  servicesPage: IService[];
  page = 1;
  pageSize = 10;
  total: number;
  searchTerm = '';

  constructor(private api: ServicesResourceService, 
              private fb: FormBuilder, 
              private route: ActivatedRoute,
              private urlValidator: UrlValidator) { }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.services = data.services;
    });
    this.refreshServices();
    this.formRow = this.fb.group({
      serviceId: [null],
      URLPing: ['', {updateOn: 'blur', validators:[Validators.required, Validators.pattern(this.regex)], asyncValidators: [this.urlValidator.checkPing('protocol').bind(this)]}],
      URLResource: ['', [Validators.required, Validators.pattern(this.regex)]],
      protocol: ['REST', [Validators.required]]
    });
  }

  edit(service: IService): void {
    this.editId = service.serviceId;
    this.serviceId.setValue(service.serviceId);
    this.URLPing.setValue(service.URLPing);
    this.URLResource.setValue(service.URLResource);
    this.URLPing.setValue(service.URLPing);
    this.protocol.setValue(service.protocol);
  }

  cancelEdit(): void {
    this.editId = null;
    this.formRow.reset();
    this.protocol.setValue('REST');
  }

  addService(): void {
    this.api.addService(this.formRow.value).subscribe(
      () => {
        Swal.fire('Servicio Añadido!', '', 'success');
        this.cancelEdit();
        this.updateListServices();
      }
    )
  }

  deleteService(service: IService): void {
    Swal.fire({
      title: `Estás Seguro de querer eliminar el servicio?`,
      text: `${service.URLResource}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.api.deleteService({id: service.serviceId }).subscribe(
          () => {
            this.updateListServices();
            this.cancelEdit();
            Swal.fire('Servicio Eliminado!', '', 'success');
          }
        )
      }
    });
  }

  reindex(website: IService){
    this.api.reindex({id: website.serviceId}).subscribe(
      () => {
        Swal.fire('Servicio Actualizado!', '', 'success');
        this.cancelEdit();
        this.updateListServices();
      }
    )
  }

  updateService(): void {
    this.api.updateService(this.formRow.value, null, {id: this.serviceId.value}).subscribe(
      () => {
        Swal.fire('Servicio Actualizado!', '', 'success');
        this.cancelEdit();
        this.updateListServices();
      }
    )
  }

  private updateListServices(): void{
    this.api.getServices().subscribe(
      (res) => {
        this.services = res;
        this.refreshServices();
        if (this.searchTerm !== ''){
          this.search();
        }
      }
    );
  }

  search(): void {
    this.servicesPage = this.services.filter(user => this.matches(user, this.searchTerm));
    this.servicesPage = this.servicesPage.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    if (this.searchTerm === '') {
      this.total = this.services.length;
    } else {
      this.total = this.servicesPage.length;
    }
  }

  refreshServices(): void {
    this.servicesPage = this.services
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    this.total = this.services.length;
  }

  private matches(service: IService, term: string): boolean {
    term = term.toLocaleLowerCase();
    return service.URLResource.toLowerCase().includes(term)
      || service.URLPing.toLocaleLowerCase().includes(term);
  }

  get serviceId(): AbstractControl {
    return this.formRow.get('serviceId');
  }

  get URLPing(): AbstractControl {
    return this.formRow.get('URLPing');
  }

  get URLResource(): AbstractControl {
    return this.formRow.get('URLResource');
  }

  get protocol(): AbstractControl {
    return this.formRow.get('protocol');
  }
}
