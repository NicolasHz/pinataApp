import { ModuleWithProviders, NgModule  } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { LoginComponent } from './../login/login.component';
import { AuthGuardService } from './../../services/auth-guard.service';

const routes: Routes = [
    { path: '', redirectTo: 'home' },
    { path: 'home',  component: HomeComponent}
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
