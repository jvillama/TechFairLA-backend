// client-side js
// run by the browser each time your view template is loaded

// by default, you've got jQuery,
// add other scripts at the bottom of index.html

$(function() {
  
  $.get('/coverletters', function(letters) {
    letters.forEach(function(letter) {
      $('<li></li>').text(JSON.stringify(letter)).appendTo('ul#dreams');
    });
  });

});
