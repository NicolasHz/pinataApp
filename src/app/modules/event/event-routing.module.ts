import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventComponent } from './event.component';

const routes: Routes = [
  { path: '',  component: EventComponent}
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

  export class EventRoutingModule { }
