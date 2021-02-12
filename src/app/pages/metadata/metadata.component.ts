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

  metadata: IMetadata[];
  metadataPage: IMetadata[];
  page = 1;
  pageSize = 10;
  total: number;

  editingControl: AbstractControl;
  editingIndex: number;

  constructor(private fb: FormBuilder,
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
        id: web.id,
        title: [web.title, [Validators.required]],
        tags: [[]]
      }))
    }
  }

  refresh(): void {
    this.metadataPage = this.metadata
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    this.total = this.metadata.length;
  }

  private updateListMetadata(): void {
    this.api.getMetadata().subscribe(
      (res) => {
        this.metadata = res;
        this.refresh();
      }
    );
  }

  edit(index: number) {
    if (this.editingControl != null)
      this.cancel();
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
    this.api.deleteUrl({ id: id }).subscribe(
      () => {
        this.form.removeAt(this.getActualIndex(index));
        Swal.fire({
          icon: 'success',
          title: 'Metadato eliminado',
          showConfirmButton: false,
          timer: 1500
        });
        this.updateListMetadata();
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
    this.api.updateUrl({id: id, title: title, tags: tags} as IMetadata).subscribe(
      () => {
        this.form.removeAt(index);
        Swal.fire({
          icon: 'success',
          title: 'Metadato aprobado',
          showConfirmButton: false,
          timer: 1500
        });
        this.updateListMetadata();
      }
    )
  }

}
