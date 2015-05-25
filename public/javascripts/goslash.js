$(function () {

// Form validation. The funny thing is that we're just using vanilla HTML5
// validation, but need to add classes to ancestor elements to get bootstrap's
// invalid input styling to kick in.
function validate (e) {
  var isInvalid = e.type === 'invalid',
      classFn = isInvalid ? 'addClass' : 'removeClass';

  $(this).closest('.input-group')[classFn]('has-error');

  if (!isInvalid) {
    this.checkValidity();
  }
}

$('input').on('keyup change blur invalid', validate);

});
