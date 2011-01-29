(function (window, $) {

  var SC = window.SC = {};

  SC.log = function () {
      if (console) {
          console.log(arguments);
      }
  };

function validateFormOnSubmit(theForm) {
	var reason = "";

	reason += validateField(theForm.name);
	reason += validateField(theForm.school);


	if (reason != "") {
		alert(reason);
		return false;
	}

	return true;
}

function validateField(fld) {
	var error = "";

	if (fld.value.length == 0) {
		fld.style.background = '#FF9999'; 
		error = "Please provide a " + fld.name + ".\n";
	} else {
		fld.style.background = 'White';
	}
	return error;   
}

$('#connect_form').submit(function() {
	return validateFormOnSubmit(this);
});

}(window, jQuery));