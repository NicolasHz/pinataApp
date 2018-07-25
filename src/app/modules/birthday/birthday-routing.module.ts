import { NgModule  } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BirthdayComponent } from './birthday.component';

const routes: Routes = [
    { path: '',  component: BirthdayComponent}
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

  export class BirthdayRoutingModule { }
