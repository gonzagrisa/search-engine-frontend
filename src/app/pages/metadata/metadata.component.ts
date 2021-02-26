import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
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
  // ICONS
  faPen = faPen;
  faDelete = faEraser;
  faCancel = faWindowClose;
  faCheck = faCheck;
  // FORM
  form: FormArray;
  // SEARCH
  metadata: IMetadata[] = [];
  metadataPage: IMetadata[];
  page = 1;
  pageSize = 10;
  total: number;
  totalSearch: number;
  searching = false;
  searchTerm = '';
  selectApproved = false;
  // SELECT
  checked: boolean = false;
  // EDIT
  editingControl: IMetadata; // AbstractControl;
  editingIndex: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private api: MetadataResourceService) { }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.metadata = data.metadata;
      this.metadata = this.metadata.concat(data.indexed);
    })
    this.search();
    this.form = this.fb.array([]);
    this.metadata.forEach((data) => {
      this.form.push(this.fb.group({
        selected: [false],
        approved: [data.approved],
        id: [data.id],
        title: [data.title, [Validators.required]],
        tags: [data.tags == null ? [] : data.tags],
        filters: [data.filters == null ? [] : data.filters]
      }));
    })
  }
  
  countSelected(): number {
    return this.form.controls.filter(control => control.get('selected').value == true).length;
  }

  selectAll(): void {
    if (this.checked) {
      if (this.selectApproved) {
        this.form.controls.filter(control => control.get('approved').value == true).map(control => control.get('selected').setValue(true));
      } else if (this.selectApproved === false) {
        this.form.controls.filter(control => control.get('approved').value == false).map(control => control.get('selected').setValue(true));
      } else{
        this.form.controls.map(control => control.get('selected').setValue(true));
      }
    }
    else {
      this.unselectAll();
    }
  }
  
  unselectAll(): void {
    this.form.controls.map(control => control.get('selected').setValue(false));
  }

  search(reset?: boolean): void {
    if (reset){
      this.page = 1;
    }
    this.cancel(true);
    this.searching = true;
    let metadataResults;
    if (this.selectApproved == null) {
      metadataResults = this.metadata.filter(metadata => this.matches(metadata, this.searchTerm));
    } else {
      metadataResults = this.metadata.filter(metadata => (metadata.approved == this.selectApproved) && this.matches(metadata, this.searchTerm));
    }
    this.metadataPage = metadataResults.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    this.totalSearch = metadataResults.length;
    this.searching = false;
  }

  private matches(metadata: IMetadata, term: string): boolean {
    term = term.toLocaleLowerCase();
    return metadata.title?.toLowerCase().includes(term)
      || metadata.URL.toLocaleLowerCase().includes(term)
      || metadata.text.toLocaleLowerCase().includes(term);
  }
  
  edit(metadata: IMetadata) {
    if (this.editingControl != null) {
      this.cancel(true);
    }
    this.editingIndex = this.getRealIndex(metadata.id);
    this.editingControl = this.form.controls[this.editingIndex].value;
  }

  cancel(reset: boolean) {
    if (this.editingControl != null && reset) {
      this.form.controls[this.editingIndex].get('title').patchValue(this.editingControl.title);
      this.form.controls[this.editingIndex].get('tags').patchValue(this.editingControl.tags);
      this.form.controls[this.editingIndex].get('filters').patchValue(this.editingControl.filters);
    }
    this.editingControl = null;
    this.editingIndex = null;
  }

  // get index by metadata id
  getRealIndex(id: string) {
    return this.metadata.findIndex(metadata => metadata.id == id);
  }

  deleteMetadata(metadata: IMetadata): void {
    this.api.deleteMetadata({ id: metadata.id }).subscribe(
      () => {
        const index = this.getRealIndex(metadata.id);
        this.form.removeAt(index);
        this.metadata.splice(index, 1);
        this.search();
        Swal.fire({ icon: 'success', title: 'Metadato eliminado', showConfirmButton: false, timer: 1500 });
      }
    );
  }

  deleteBatch(): void {
    Swal.fire({ icon: 'question', title: 'Estás seguro de querer eliminar los metatados seleccionados?', showConfirmButton: true, showCancelButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        const selected: IMetadata[] = this.form.value.filter(control => control['selected'] == true);
        this.api.deleteBatch(selected).subscribe(
          () => {
            Swal.fire({ icon: 'success', title: 'Metadatos eliminados', showConfirmButton: false, timer: 1500 });
            this.refreshData(selected.length);
          }
        )
      }
    });
  }

  approve(data: IMetadata): void {
    const index = this.getRealIndex(data.id);
    let metadata = (this.form.controls[index].value as IMetadata);
    this.api.updateMetadata(metadata).subscribe(
      () => {
        this.metadata[index].title = metadata.title;
        this.metadata[index].approved = true;
        this.form.controls[index].get('approved').setValue(true);
        Swal.fire({ icon: 'success', title: 'Operación Exitosa', showConfirmButton: false, timer: 1500 });
        this.cancel(false);
        this.search();
      }
    );
  }

  updateBatch(): void {
    let selected: IMetadata[] = this.form.value.filter(control => control['selected'] == true);
    this.api.updateBatch(selected).subscribe(
      () => {
        selected.forEach((item) => {
          let index = this.getRealIndex(item.id);
          this.metadata[index].title = item.title;
          this.metadata[index].approved = true;
          this.form.controls[index].get('approved').setValue(true);
        })
        Swal.fire({icon: 'success', title: 'Metadatos aprobados y actualizados', showConfirmButton: false, timer: 1500});
        this.search();
        this.unselectAll();
      }
    )
  }

  private refreshData(size: number): void {
    for (let index = 0; index < size; index++) {
      let index = this.form.controls.findIndex(control => control.get('selected').value == true);
      this.form.removeAt(index);
      this.metadata.splice(index, 1);
    }
    this.search();
  }
}
