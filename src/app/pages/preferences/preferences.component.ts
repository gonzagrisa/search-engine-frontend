import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { faMicrophone, faSearch } from '@fortawesome/free-solid-svg-icons';
import { IPreferences } from 'src/app/api/models/i-preferences';
import { PreferencesResourceService } from 'src/app/api/resources/preferences-resource.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.css']
})
export class PreferencesComponent implements OnInit {

  form: FormGroup;

  faSearch = faSearch;
  faMic = faMicrophone;

  preferences: IPreferences;

  constructor(private api: PreferencesResourceService, private fb: FormBuilder, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.data.subscribe((data) =>{
      this.preferences = data.preferences;
    });
    this.form = this.fb.group({
      borderRadius: [this.preferences.borderRadius],
      borderWidth: [this.preferences.borderWidth],
      iconURL: [this.preferences.iconURL],
      iconSize: [this.preferences.iconSize],
      placeholder: [this.preferences.placeholder],
      color: [this.preferences.color]
    });
  }

  getFile(): void {
    this.api.getFile().subscribe(
      (data) => {
        this.downloadFile(data)
      },
      (err) => console.log(err),
      () => console.info('OK'));
  }

  updatePreferences(): void {
    this.api.updatePreferences(this.form.value).subscribe(
      () => {
        Swal.fire({
          icon: 'success',
          title: 'Preferencias Actualizadas',
          showConfirmButton: false,
          timer: 1500
        });
      }
    )
  }

  downloadFile(data: Blob) {
    const blob = new Blob([data], { type: 'application/zip' });
    const url = window.URL.createObjectURL(blob);
    var anchor = document.createElement("a");
    anchor.download = "myfile.zip";
    anchor.href = url;
    anchor.click();
  }

  get borderWidth(): AbstractControl {
    return this.form.get('borderWidth');
  }

  get borderRadius(): AbstractControl {
    return this.form.get('borderRadius');
  }

  get iconURL(): AbstractControl {
    return this.form.get('iconURL');
  }

  get iconSize(): AbstractControl {
    return this.form.get('iconSize');
  }

  get color(): AbstractControl {
    return this.form.get('color');
  }

  get placeholder(): AbstractControl {
    return this.form.get('placeholder');
  }

}
