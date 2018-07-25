export const START_TIME_PICKER_OPTIONS: any = {
  default: 'now', // Set default time: 'now', '1:30AM', '16:30'
  fromnow: 0,       // set default time to * milliseconds from now (using with default = 'now')
  twelvehour: false, // Use AM/PM or 24-hour format
  donetext: 'OK', // text for done-button
  cleartext: 'Clear', // text for clear-button
  canceltext: 'Cancel', // Text for cancel-button
  autoclose: true, // automatic close timepicker
  ampmclickable: false, // make AM PM clickable
};
export const END_TIME_PICKER_OPTIONS: any = {
  default: 'now', // Set default time: 'now', '1:30AM', '16:30'
  fromnow: 0,       // set default time to * milliseconds from now (using with default = 'now')
  twelvehour: false, // Use AM/PM or 24-hour format
  donetext: 'OK', // text for done-button
  cleartext: 'Clear', // text for clear-button
  canceltext: 'Cancel', // Text for cancel-button
  autoclose: true, // automatic close timepicker
  ampmclickable: false, // make AM PM clickable
};
export const START_DATE_PICKER_OPTIONS: Pickadate.DateOptions = {
  clear: 'Clear', // Clear button text
  close: 'Ok',    // Ok button text
  today: 'Today', // Today button text
  closeOnClear: false,
  closeOnSelect: true,
  min: new Date(),
  format: 'dd/mm/yyyy', // Visible date format (defaulted to formatSubmit if provided otherwise 'd mmmm, yyyy')
  formatSubmit: 'yyyy-mm-dd',   // Return value format (used to set/get value)
};
export const END_DATE_PICKER_OPTIONS: Pickadate.DateOptions = {
  clear: 'Clear', // Clear button text
  close: 'Ok',    // Ok button text
  today: 'Today', // Today button text
  closeOnClear: false,
  closeOnSelect: true,
  format: 'dd/mm/yyyy', // Visible date format (defaulted to formatSubmit if provided otherwise 'd mmmm, yyyy')
  formatSubmit: 'yyyy-mm-dd',   // Return value format (used to set/get value) yyyy-mm-dd
};

export const MODAL_OPTIONS: Materialize.ModalOptions = {
  dismissible: true, // Modal can be dismissed by clicking outside of the modal
  opacity: .2, // Opacity of modal background
  inDuration: 300, // Transition in duration
  outDuration: 200, // Transition out duration
  startingTop: '100%', // Starting top style attribute
  endingTop: '0%', // Ending top style attribute
};

export const ERROR_MESSAGES_RESOURCES = {
  title: {
    required: 'Title is required.',
  },
  startDate: {
    required: 'Start date is required.',
  },
  endDate: {
    required: 'End date is required.',
  },
  startHour: {
    required: 'Start hour is required.',
  },
  endHour: {
    required: 'End hour is required.',
    incorrect: 'End hour can\'t be lesser than start hour'
  },
  description(minLenght = 20, maxLenght = 255) {
    return {
      required: 'You need a description.',
      minlength: `Min lenght ${minLenght} characters.`,
      maxlength: `Description cannot be more than ${maxLenght} characters long.`,
      validString: 'Description can\'t be only white-spaces.'
    };
  },
  message(minLenght = 20, maxLenght = 255) {
    return {
      required: 'You need a message.',
      minlength: `Min lenght ${minLenght} characters.`,
      maxlength: `Message cannot be more than ${maxLenght} characters long.`,
      validString: 'Message can\'t be only white-spaces.'
    };
  },
  image: {
    maxlength: 'This URL cannot be more than 350 characters long.'
  },
  fullName: {
    required: 'Don\'t you have a name?',
    validString: 'This can\'t be only white-spaces.'
  },
  birthday: {
    required: 'What day did you born?',
  },
  preferences: {
    required: 'What are your preferences?.',
    validString: 'This can\'t be only white-spaces.',
    maxlength: 'Preference cannot be more than 15 characters long.',
  }
};

const legalAge = new Date();
legalAge.setFullYear(new Date().getFullYear() - 18);
export const DATE_OF_BIRTH_PICKER_OPTIONS: Pickadate.DateOptions = {
  clear: 'Clear', // Clear button text
  close: 'Ok',    // Ok button text
  today: 'Today', // Today button text
  closeOnClear: false,
  closeOnSelect: true,
  max: legalAge,
  selectYears: 40,
  format: 'dd/mm/yyyy', // Visible date format (defaulted to formatSubmit if provided otherwise 'd mmmm, yyyy')
  formatSubmit: 'yyyy-mm-dd',   // Return value format (used to set/get value)
};
