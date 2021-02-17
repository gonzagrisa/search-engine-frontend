import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IStats } from 'src/app/api/models/i-stats';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  stats: IStats;

  constructor(public authService: AuthService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.data.subscribe((data) =>{
      this.stats = data.stats;
    });
  }

}
