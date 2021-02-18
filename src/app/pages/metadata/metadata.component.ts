import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { faCheck, faEraser, faPen, faWindowClose } from '@fortawesome/free-solid-svg-icons';
import { IMetadata } from 'src/app/api/models/i-metadata';
import { MetadataResourceService } from 'src/app/api/resources/metadata-resource.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-metadata',
  templateUrl: './metadata.component.html',
  styleUrls: ['./metadata.component.css']
})
export class MetadataComponent implements OnInit {

  form: FormArray;

  faPen = faPen;
  faDelete = faEraser;
  faCancel = faWindowClose;
  faCheck = faCheck;

  metadata: IMetadata[] = [];
  metadataPage: IMetadata[];
  page = 1;
  pageSize = 10;
  total: number;

  checked: boolean = false;

  editingControl: AbstractControl;
  editingIndex: number;


  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private api: MetadataResourceService) { }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.metadata = data.metadata;
    })
    this.refresh();
    this.form = this.fb.array([]);
    for (let web of this.metadata) {
      this.form.push(this.fb.group({
        selected: [false],
        id: [web.id],
        title: [web.title, [Validators.required]],
        tags: [[]],
        filters: [[]]
      }));
    }
  }

  getSelected() {
    return this.form.controls.filter(control => control.get('selected').value == true);
  }

  countSelected(): number {
    return this.form.controls.filter(control => control.get('selected').value == true).length;
  }

  selectAll(): void {
    if (this.checked){
      this.form.controls.map(control => control.get('selected').setValue(true));
    }
    else{
      this.form.controls.map(control => control.get('selected').setValue(false));
    }
  }

  refresh(): void {
    this.metadataPage = this.metadata
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    this.total = this.metadata.length;
  }

  edit(index: number) {
    if (this.editingControl != null){
      this.cancel();
    }
    this.editingIndex = this.getActualIndex(index);
    this.editingControl = this.form.controls[this.editingIndex].value
  }

  cancel() {
    if (this.editingControl != null){
      this.form.controls[this.editingIndex].patchValue(this.editingControl);
      this.editingControl = null;
    }
    this.editingIndex = null;
  }

  getActualIndex(i: number){
    return (this.page - 1) * this.pageSize + i;
  }

  deleteMetadata(id: string, index: number): void {
    this.api.deleteMetadata({ id: id }).subscribe(
      () => {
        this.form.removeAt(this.getActualIndex(index));
        this.metadata.splice(this.getActualIndex(index), 1);
        this.refresh();
        Swal.fire({
          icon: 'success',
          title: 'Metadato eliminado',
          showConfirmButton: false,
          timer: 1500
        });
      }
    );
  }

  approve(i: number): void {
    const index = this.getActualIndex(i);
    const control = this.form.controls[index];
    const id = control.get('id').value
    const title = control.get('title').value;
    const tagsControl = control.get('tags').value;
    let tags = tagsControl.map(x => x.value);
    const filtersControl = control.get('filters').value;
    let filters = filtersControl.map(x => x.value);
    this.api.updateMetadata({id: id, title: title, tags: tags, filters: filters} as IMetadata).subscribe(
      () => {
        this.form.removeAt(index);
        this.metadata.splice(index, 1);
        this.refresh();
        Swal.fire({
          icon: 'success',
          title: 'Metadato aprobado',
          showConfirmButton: false,
          timer: 1500
        });
      }
    );
  }

  deleteBatch(): void {
    Swal.fire({
      icon: 'question',
      title: 'Estás seguro de querer eliminar los metatados seleccionados?',
      showConfirmButton: true,
      showCancelButton: true
    }).then((result) => {
      if (result.isConfirmed){
        const selected: IMetadata[] = this.form.value.filter(control => control['selected'] == true);
        this.api.deleteBatch(selected).subscribe(
          () => {
            Swal.fire({
              icon: 'success',
              title: 'Metadatos eliminados',
              showConfirmButton: false,
              timer: 1500
            });
            this.refreshData(selected.length);
          }
        )
      }
    });
  }

  updateBatch(): void {
    let selected: IMetadata[] = this.form.value.filter(control => control['selected'] == true);
    selected.forEach(metadata => {
      metadata.tags = metadata.tags.map(x => x['value']);
      metadata.filters = metadata.filters.map(x => x['value'])
    });
    this.api.updateBatch(selected).subscribe(
      () => {
        Swal.fire({
          icon: 'success',
          title: 'Metadatos aprobados y actualizados',
          showConfirmButton: false,
          timer: 1500
        });
        this.refreshData(selected.length);
      }
    )
  }

  refreshData(size: number): void{
    for (let index = 0; index < size; index++) {
      let index = this.form.controls.findIndex(control => control.get('selected').value == true);
      this.form.removeAt(index);
      this.metadata.splice(index, 1);
    }
    this.refresh();
  }
}
