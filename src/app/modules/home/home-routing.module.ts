import { ModuleWithProviders, NgModule  } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { LoginComponent } from './../login/login.component';

const routes: Routes = [
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
