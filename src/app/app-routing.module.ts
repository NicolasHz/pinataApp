import { HomeComponent } from './modules/home/home.component';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const appRoutes: Routes = [
    { path: '', loadChildren: 'app/modules/home/home.module#HomeModule' }
];

@NgModule({
    imports: [
      RouterModule.forRoot(appRoutes)
    ],
    declarations: [],
    exports: [
      RouterModule
    ]
  })
  export class RoutingModule { }
