import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'DogDogGo';
  constructor(private router: Router) {}


  enable(){
    return this.router.url != '/404';
  }

}
