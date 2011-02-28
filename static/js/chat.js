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

  //Placeholder variable for a person who request to chat
  var requestor_id = "";

  var SC = window.SC = {};

  SC.log = function () {
      if (console) {
          console.log(arguments);
      }
  };

  function assert_presence(){
    $.post('/presence?client_id=' + self_id, {} , function(){} , 'json');
  }
  
  function sendChatRequest(row){
	client_id = $(row).parent().attr("id");
    $.post('/request_chat?client_id=' + client_id + '&requestor_id=' + self_id, {}, function(){}, 'json');
    SC.log("sendChatRequest()");
  }

  function updateWithRequest(client_id){
    requestor_id = client_id;

    var targetButton = $(client_id);
    targetButton.innerHTML = "Requests to chat!  <button class='target_accept'>Accept</button>"
    $('.target_accept').click(function () {
	  confirmChatRequest($(this).parent().attr("id"));
	  return false;
    });
    SC.log("updateWithRequest()");
  }

  //sends a confirmation to the person who requested to chat
  function confirmChatRequest(row){
	client_id = $(row).parent().attr("id");
	$.post('/confirm_chat?client_id=' + client_id + '&confirm_id=' + self_id, {}, function(){}, 'json');
	SC.log("confirmChatRequest");
  }

  function connectToTarget(target_id){
	
	SC.log(target_id);	
	var target_row = $("#" + target_id).parent().children();
	SC.log(target_row);
	var target_row_ids = $(target_row).map(function() {
	  return this.id;
	}).get()
	SC.log(target_row_ids);

    var studentsconnect = document.getElementById("studentsconnect");
    studentsconnect.connectToTarget(self_id,
	                                target_id,
							        target_row_ids[0], //name
							        target_row_ids[1], //school
							        target_row_ids[2]); //language
    SC.log("connectToTarget()");
  }
  
  function updatePresentUsersList(present_users){
    $("#available_users").html(
      $.map(present_users, function(u){
	    var button_content = "<button class='target_connect'>Connect</button>";
	    if(u["client_id"]==requestor_id){
		  button_content = "Requests to chat!  <button class='target_accept'>Accept</button>"
	    }
        return "<tr class='user'><td id=" + u["name"] + ">Name: " + u["name"] + 
		   "</td><td id=" + u["school"] + ">School: " + u["school"] + 
		   "</td><td id=" + u["language"] + ">Language: " + u["language"] + 
		   "</td><td id=" + u["client_id"] + ">" + button_content + "</td></tr>";
      }).join(""));

		//Adds 'alt' class to event table rows to add zebra-striping look
		$('#available_users tr:even').addClass('alt');

		//Adds a listener to each rows button that passes that rows info to the SWF when clicked
		$('.target_connect').click(function () {
		  sendChatRequest(this);
          return false;
		});
		
		//Adds a listener to the button in a row with a chat request
		$('.target_accept').click(function () {
	      confirmChatRequest(this);
	      connectToTarget($(this).parent().attr("id"));
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
          updateWithRequest(chat_request);          
        }
        
        var present_users = response.present_users;
        if(present_users){
          SC.log(present_users);
          updatePresentUsersList(present_users);
        }

        var confirmed_request = response.confirmed_request;
        if(confirmed_request){
	      SC.log(confirmed_request);
	      connectToTarget(confirmed_request);
        }

      };

      socket.onerror = function () {
          alert('error');
      };
      socket.onclose = function () {};
    
      SC.socket = socket;
  };
  

}(window, jQuery));