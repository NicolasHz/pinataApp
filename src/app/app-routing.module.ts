import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MzTooltipModule, MzButtonModule, MzIconMdiModule } from 'ngx-materialize';

// Guards
import { AuthGuardService } from './services/auth-guard/auth-guard';

// Components
import { LoginComponent } from './modules/login/login.component';
import { NotFoundComponent } from './modules/not-found/not-found.component';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: 'app/modules/home/home.module#HomeModule',
    canActivate: [AuthGuardService]
  },
  {
    path: 'birthdays',
    loadChildren: 'app/modules/birthday/birthday.module#BirthdayModule',
    canActivate: [AuthGuardService]
  },
  {
    path: 'events',
    loadChildren: 'app/modules/event/event.module#EventModule',
    canActivate: [AuthGuardService]
  },
  {
    path: 'my-account',
    loadChildren: 'app/modules/my-account/my-account.module#MyAccountModule',
    canActivate: [AuthGuardService]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '**',
    redirectTo: '/not-found'
  },
  {
    path: 'not-found',
    component: NotFoundComponent
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes),
    MzTooltipModule,
    MzButtonModule,
    MzIconMdiModule
  ],
  declarations: [
    LoginComponent,
    NotFoundComponent
  ],
  exports: [
    RouterModule
  ]
})
export class RoutingModule { }
