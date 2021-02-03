import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TableFormComponent } from './aux/table-form/table-form.component';
import { AuthGuard } from './core/guards/auth.guard';
import { InfoResolver } from './core/resolvers/info-resolver';
import { UsersResolver } from './core/resolvers/users-resolver';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LandingComponent } from './pages/landing/landing.component';
import { LoginComponent } from './pages/login/login.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ServicesComponent } from './pages/services/services.component';
import { SignupComponent } from './pages/signup/signup.component';
import { TermsComponent } from './pages/terms/terms.component';
import { UsersComponent } from './pages/users/users.component';
import { WebsitesComponent } from './pages/websites/websites.component';

const routes: Routes = [
  {path: '', component: LandingComponent},
  {path: 'login', component: LoginComponent, canActivate: [AuthGuard]},
  {path: 'signup', component: SignupComponent, canActivate: [AuthGuard]},
  {path: 'profile', component: ProfileComponent, resolve: {user: InfoResolver}},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'users', component: UsersComponent, resolve: {users: UsersResolver}},
  {path: 'websites', component: WebsitesComponent},
  {path: 'services', component: ServicesComponent},
  {path: '404', component: NotFoundComponent},
  {path: 'table', component: TableFormComponent},
  {path: 'terms', component: TermsComponent},
  {path: '**', pathMatch: 'full', redirectTo: '404'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
