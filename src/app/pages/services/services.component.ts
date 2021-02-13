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

  regex = new RegExp("^(http:\\/\\/www\\.|https:\\/\\/www\\.|http:\\/\\/|https:\\/\\/)[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*((\\.([a-z]{2,5}))(:[0-9]{1,5})?|(:[0-9]{1,5}))(\\/.*)?$");
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
      URLPing: ['', { updateOn: 'blur', validators: [Validators.required, Validators.pattern(this.regex)], asyncValidators: [this.urlValidator.checkPing('protocol').bind(this)] }],
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

  checkSubmit(): boolean {
    if ((this.URLResource.value.toLocaleLowerCase().includes("?wsdl") && this.protocol.value == "REST")
      || (!this.URLResource.value.toLocaleLowerCase().includes("?wsdl") && this.protocol.value == "SOAP")) {
      Swal.fire('Error', 'El recurso no coincide con el protocolo', 'error');
      return false;
    }
    return true;
  }

  addService(): void {
    if (!this.checkSubmit()) {
      return;
    }
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
      title: `Estás Seguro de querer eliminar el servicio?`, text: `${service.URLResource}`,
      icon: 'warning', showCancelButton: true, confirmButtonText: 'Sí, eliminar'
    })
      .then((result) => {
        if (service.indexed == false) {
          this.api.deleteService(service, { keepWebsites: false }, { id: service.serviceId }).subscribe(
            () => {
              this.updateListServices();
              this.cancelEdit();
              Swal.fire('Servicio Eliminado!', '', 'success');
            }
          )
        }
        else if (result.isConfirmed) {
          Swal.fire({
            title: `Desea mantener las paginas indexadas provenientes del servicio?`,
            icon: 'warning', showDenyButton: true,
            confirmButtonText: 'Sí', denyButtonText: `No`
          })
            .then((result) => {
              if (result.isConfirmed) {
                this.api.deleteService(service, { keepWebsites: true }, { id: service.serviceId }).subscribe(
                  () => {
                    this.updateListServices();
                    this.cancelEdit();
                    Swal.fire('Servicio Eliminado!', '', 'success');
                  }
                )
              } else {
                this.api.deleteService(service, { keepWebsites: false }, { id: service.serviceId }).subscribe(
                  () => {
                    this.updateListServices();
                    this.cancelEdit();
                    Swal.fire('Servicio Eliminado!', '', 'success');
                  }
                )
              }
            })
        }
      });
  }

  reindex(service: IService) {
    this.api.reindexService(service).subscribe(
      () => {
        Swal.fire('Servicio Actualizado!', '', 'success');
        this.cancelEdit();
        this.updateListServices();
      }
    )
  }

  updateService(): void {
    if (!this.checkSubmit()) {
      return;
    }
    this.api.updateService(this.formRow.value, null, { id: this.serviceId.value }).subscribe(
      () => {
        Swal.fire('Servicio Actualizado!', '', 'success');
        this.cancelEdit();
        this.updateListServices();
      }
    )
  }

  checkProtocol(url: string): void {
    if (url.toLocaleLowerCase().includes("?wsdl")) {
      this.protocol.setValue('SOAP');
    } else {
      this.protocol.setValue('REST');
    }
  }

  private updateListServices(): void {
    this.api.getServices().subscribe(
      (res) => {
        this.services = res;
        this.refreshServices();
        if (this.searchTerm !== '') {
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
