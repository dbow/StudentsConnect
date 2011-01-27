(function (window, $) {

  var SC = window.SC = {};

  SC.log = function () {
      if (console) {
          console.log(arguments);
      }
  };

}(window, jQuery));