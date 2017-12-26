import { ModuleWithProviders, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const appRoutes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    // { path: 'home', component: MoviesListComponent },
    // { path: 'not-found', component: NotfoundComponent },
    { path: '**', redirectTo: '/not-found' }
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
