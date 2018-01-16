import { ModuleWithProviders, NgModule  } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { LoginComponent } from './../login/login.component';
import { AuthGuardService } from './../../services/auth-guard.service';

const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    // { path: 'home2', component: HomeComponent},
    { path: 'home',
      component: HomeComponent,
      canActivate: [
        AuthGuardService
      ]},
    { path: 'login', component: LoginComponent },
    // { path: 'not-found', component: LoginComponent },
    { path: '**', redirectTo: '/not-found' }
];

@NgModule({
    imports: [
      RouterModule.forChild(routes)
    ],
    declarations: [],
    exports: [
      RouterModule
    ]
  })

  export class HomeRoutingModule { }
