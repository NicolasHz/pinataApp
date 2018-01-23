import { ModuleWithProviders, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Guards
import { AuthGuardService } from './services/auth-guard.service';

// Components
import { LoginComponent } from './modules/login/login.component';

const appRoutes: Routes = [
    { path: '', loadChildren: 'app/modules/home/home.module#HomeModule',
    canActivate: [
      AuthGuardService
    ] },
    { path: 'login', component: LoginComponent },
    { path: '**', redirectTo: '/not-found' },
     // { path: 'not-found', component: LoginComponent },
];

@NgModule({
    imports: [
      RouterModule.forRoot(appRoutes)
    ],
    declarations: [
      LoginComponent
    ],
    exports: [
      RouterModule
    ]
  })
  export class RoutingModule { }
