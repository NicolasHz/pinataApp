export const TIME_PICKER_OPTIONS: Pickadate.TimeOptions = {
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
    required: 'Start date is required.',
  },
  startHour: {
    required: 'Start hour is required.',
  },
  endHour: {
    required: 'Start hour is required.',
  },
  description: {
    required: 'You need a description for this event.',
    minlength: 'Min lenght 20 characters.',
    maxlength: 'Description cannot be more than 255 characters long.',
    validString: 'Description can\'t be only white-spaces.'
  },
  image: {
    maxlength: 'This URL cannot be more than 350 characters long.'
  },
};

export const IMAGES_CARD_SOURCE = [
  'https://firebasestorage.googleapis.com/v0/b/miseventos-ebcef.appspot.com/o/images%2Fparty.gif?alt=media&token=4ab2681d-b062-44e9-b57c-cb61e1cdac03',
  'https://firebasestorage.googleapis.com/v0/b/miseventos-ebcef.appspot.com/o/images%2Fparty0.gif?alt=media&token=0d09eb94-4a72-45a0-a798-01984dbf6d2d',
  'https://firebasestorage.googleapis.com/v0/b/miseventos-ebcef.appspot.com/o/images%2Fparty1.gif?alt=media&token=d56b3787-63ad-489d-8512-cc805feced27',
  'https://firebasestorage.googleapis.com/v0/b/miseventos-ebcef.appspot.com/o/images%2Fparty2.gif?alt=media&token=33153164-4634-4ff4-91af-853c52f870d8'];
