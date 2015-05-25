$(function () {

// Form validation. The funny thing is that we're just using vanilla HTML5
// validation, but need to add classes to ancestor elements to get bootstrap's
// invalid input styling to kick in.
$('form')
  .on('keyup change blur', function () {
    $(this).find('.input-group').removeClass('has-error');
    $(this).checkValidity();
  })
  // Need element-level styling.
  .find('input').on('invalid', function () {
    $(this).closest('.input-group').addClass('has-error');
  });

});
