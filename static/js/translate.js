(function (window, $) {

  // Initialize version 1.0 of Google AJAX API
  google.load("language", "1");

  $("#language_selector").change(function() {
    translate(this.options[this.selectedIndex].value);
  });

  function translate(lang) {
    var source = document.getElementById("query").value;
    var len = source.length;

    // Google Language API accepts 500 characters per request 
    var words = 500;

    for(i=0; i<=(len/words); i++) {
      google.language.translate (source.substr(i*words, words),
                  "", lang, function (result) {
      if (!result.error) {
 	 document.getElementById("query").value = result.translation;
     } }); }  

   return false;
  }

}(window, jQuery));