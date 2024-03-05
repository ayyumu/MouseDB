
  document.addEventListener('DOMContentLoaded', function() {
    function addClasses() {
      // select elements to add class to
      var uiElements = document.querySelectorAll('.ui:not(.button):not(.input):not(.popup)');
      var bodyAndFirstTh = document.querySelectorAll('body, #firstTh');
      var images = document.querySelectorAll('img:not(.infoData)');

      // adding classes
      uiElements.forEach(function(element) {
        element.classList.add('inverted');
      });
      bodyAndFirstTh.forEach(function(element) {
        element.classList.add('bBack');
      });
      images.forEach(function(element) {
        element.classList.add('invImg');
      });
    }

    // execute
    addClasses();
  });