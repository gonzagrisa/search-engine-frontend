import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TableFormComponent } from './aux-pages/table-form/table-form.component';
import { AdminGuard } from './core/guards/admin.guard';
import { AuthGuard } from './core/guards/auth.guard';
import { LoggedInGuard } from './core/guards/logged-in.guard';
import { InfoResolver } from './core/resolvers/info-resolver';
import { MetadataIndexedResolver } from './core/resolvers/metadata-indexed-resolver';
import { MetadataResolver } from './core/resolvers/metadata-resolver';
import { PreferencesResolver } from './core/resolvers/preferences-resolver';
import { ServicesResolver } from './core/resolvers/services-resolver';
import { UsersResolver } from './core/resolvers/users-resolver';
import { WebsitesResolver } from './core/resolvers/websites-resolver';
import { StatsResolver } from './core/resolvers/stats-resolver';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DocsComponent } from './pages/docs/docs.component';
import { LandingComponent } from './pages/landing/landing.component';
import { LoginComponent } from './pages/login/login.component';
import { MetadataComponent } from './pages/metadata/metadata.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { PreferencesComponent } from './pages/preferences/preferences.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ServicesComponent } from './pages/services/services.component';
import { SignupComponent } from './pages/signup/signup.component';
import { TermsComponent } from './pages/terms/terms.component';
import { UsersComponent } from './pages/users/users.component';
import { WebsitesComponent } from './pages/websites/websites.component';

const routes: Routes = [
  {path: '',          component: LandingComponent},
  {path: 'login',     component: LoginComponent,     canActivate: [LoggedInGuard]},
  {path: 'signup',    component: SignupComponent,    canActivate: [LoggedInGuard]},
  {path: 'profile',   component: ProfileComponent,   canActivate: [AuthGuard],  resolve: {user: InfoResolver}},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], resolve: {stats: StatsResolver}},
  {path: 'users',     component: UsersComponent,     canActivate: [AdminGuard], resolve: {users: UsersResolver}},
  {path: 'websites',  component: WebsitesComponent,  canActivate: [AuthGuard],  resolve: {websites: WebsitesResolver}},
  {path: 'services',  component: ServicesComponent,  canActivate: [AuthGuard],  resolve: {services: ServicesResolver}},
  {path: 'metadata',  component: MetadataComponent,  canActivate: [AuthGuard], resolve: {metadata: MetadataResolver, indexed: MetadataIndexedResolver}},
  {path: 'preferences',  component: PreferencesComponent, canActivate: [AuthGuard], resolve: {preferences: PreferencesResolver, user: InfoResolver}},
  {path: 'docs',       component: DocsComponent},
  {path: '404',       component: NotFoundComponent},
  {path: 'table',     component: TableFormComponent},
  {path: 'terms',     component: TermsComponent},
  {path: '**', pathMatch: 'full', redirectTo: '404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
