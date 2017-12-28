import { ModuleWithProviders, NgModule  } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';

const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    // { path: 'not-found', component: NotfoundComponent },
    // { path: '**', redirectTo: '/not-found' }
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
