import { ModuleWithProviders, NgModule  } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { MyAccountComponent } from './my-account.component';
import { ProfileComponent } from './profile/profile.component';
import { MyEventsComponent } from './my-events/my-events.component';

const routes: Routes = [
    { path: '',  component: MyAccountComponent,
      children: [
        { path: '',  redirectTo: 'profile', pathMatch: 'full' },
        { path: 'profile',  component: ProfileComponent},
        { path: 'my-events',  component: MyEventsComponent}
      ]
    },
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

  export class MyAccountRoutingModule { }
