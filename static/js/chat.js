(function (window, $) {

  //Function to pull URL parameters into a map
  $.extend({
	getUrlVars: function(){
		var vars = [], hash;
		var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
		for(var i = 0; i < hashes.length; i++)
		{
			hash = hashes[i].split('=');
			vars.push(hash[0]);
			vars[hash[0]] = hash[1];
		}
		return vars;
	},
	getUrlVar: function(name){
		return $.getUrlVars()[name];
	}
  });

  //Gets the URL parameter of 'client_id' and stores it in 'self_id' variable
  var self_id = $.getUrlVar('client_id');

  var SC = window.SC = {};

  SC.log = function () {
      if (console) {
          console.log(arguments);
      }
  };

  function assert_presence(){
    $.post('/presence?client_id=' + self_id, {} , function(){} , 'json');
  }
  
  function sendChatRequest(client_id){
    $.post('/request_chat?client_id=' + client_id, {}, function(){}, 'json')
  }
  
  function updatePresentUsersList(present_users){
    $("#available_users").html(
      $.map(present_users, function(u){
        return "<tr class='user'><td id=" + u["name"] + ">Name: " + u["name"] + 
		   "</td><td id=" + u["school"] + ">School: " + u["school"] + 
		   "</td><td id=" + u["language"] + ">Language: " + u["language"] + 
		   "</td><td id=" + u["client_id"] + "><button class='target_connect'>Connect</button></td></tr>";
      }).join(""));

		//Adds 'alt' class to event table rows to add zebra-striping look
		$('#available_users tr:even').addClass('alt');

		//Adds a listener to each rows button that passes that rows info to the SWF when clicked
		$('.target_connect').click(function () {
		  sendChatRequest($(this).parent().attr("id"));
			var parent_row = $(this).parents('.user').children();
			var parent_row_ids = $(parent_row).map(function() {
				return this.id;
				}).get()
			console.log(parent_row_ids);
			var studentsconnect = document.getElementById("studentsconnect");
			studentsconnect.connectToTarget(self_id,
											parent_row_ids[3],
											parent_row_ids[0],
											parent_row_ids[1],
											parent_row_ids[2])
			return false;
		});
  }

  SC.addToken = function (token) {
      var channel = new goog.appengine.Channel(token);
      var socket = channel.open();
    
      socket.onopen = function () {
        setInterval(function() { assert_presence(); }, 5000);
      };

    	//Parses JSON response and creates a table row with the response elements as IDs
      socket.onmessage = function (m){
        var response = JSON.parse(m.data);
        SC.log(response);
        
        var chat_request = response.chat_request;
        if(chat_request){
          SC.log(chat_request);
          alert(chat_request);          
        }
        
        var present_users = response.present_users;
        if(present_users){
          SC.log(present_users);
          updatePresentUsersList(present_users);
        }

      };

      socket.onerror = function () {
          alert('error');
      };
      socket.onclose = function () {};
    
      SC.socket = socket;
  };
  

}(window, jQuery));