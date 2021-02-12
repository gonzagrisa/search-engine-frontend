import { Component, OnInit } from '@angular/core';
import { ControlContainer } from '@angular/forms';

@Component({
  selector: 'app-website-form',
  templateUrl: './website-form.component.html',
  styleUrls: ['./website-form.component.css']
})
export class WebsiteFormComponent implements OnInit {

  constructor(public controlContainer: ControlContainer) { }

  ngOnInit(): void {
  }

}
