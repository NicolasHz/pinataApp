import { AbstractControl } from '@angular/forms';

export function IsEmptyValidator(control: AbstractControl) {
    if (control.value) {
        if (control.value.trim().length > 0) {
            return null;
            }
        return { validString: true };
    }
    return null;
}
