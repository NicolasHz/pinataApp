import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    MzInputModule,
    MzCheckboxModule,
    MzRadioButtonModule,
    MzValidationModule,
    MzTimepickerModule,
    MzIconMdiModule,
    MzIconModule,
    MzSidenavModule,
    MzNavbarModule,
    MzTextareaModule,
    MzDatepickerModule,
    MzSelectModule,
    MzCollapsibleModule,
    MzButtonModule,
    MzModalModule,
    MzTooltipModule,
    MzSpinnerModule
} from 'ng2-materialize';

@NgModule({
    imports: [
        MzInputModule,
        MzCheckboxModule,
        MzRadioButtonModule,
        MzValidationModule,
        MzTimepickerModule,
        MzNavbarModule,
        MzSidenavModule,
        MzIconModule,
        MzIconMdiModule,
        MzTextareaModule,
        MzDatepickerModule,
        MzSelectModule,
        MzCollapsibleModule,
        MzButtonModule,
        MzModalModule,
        MzTooltipModule,
        MzSpinnerModule
    ],
    exports: [
        MzInputModule,
        MzCheckboxModule,
        MzRadioButtonModule,
        MzValidationModule,
        MzTimepickerModule,
        MzNavbarModule,
        MzSidenavModule,
        MzIconModule,
        MzIconMdiModule,
        MzTextareaModule,
        MzDatepickerModule,
        MzSelectModule,
        MzCollapsibleModule,
        MzButtonModule,
        MzModalModule,
        MzTooltipModule,
        MzSpinnerModule
    ]
})
export class MaterialModule { }
