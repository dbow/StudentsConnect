$("#connect2").click(function () {
      var id = generateID();
      $("id").val(id);
      alert('test');

	function generateID () {
	    var text = "";
	    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	    for( var i=0; i < 5; i++ )
	        text += possible.charAt(Math.floor(Math.random() * possible.length));
	    return text;
	    console.log('test2');
	}
});