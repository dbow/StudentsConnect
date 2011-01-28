(function (window, $) {

  var SC = window.SC = {};

  SC.log = function () {
      if (console) {
          console.log(arguments);
      }
  };

  function assert_presence(){
    $.post('/presence?client_id=' + $("#user_id").text(), {} , function(){} , 'json');
  }

  SC.addToken = function (token) {
      var channel = new goog.appengine.Channel(token);
      var socket = channel.open();
    
      socket.onopen = function () {
        setInterval(function() { assert_presence(); }, 5000);
      };
      socket.onmessage = function (m){
        var present_users = JSON.parse(m.data);
        SC.log(present_users);
        $("#available_users").html(
          $.map(present_users, function(u){
            return "<p>" + u["name"] + "</p>";
          }).join(""));
      };
      socket.onerror = function () {
          alert('error');
      };
      socket.onclose = function () {};
    
      SC.socket = socket;
  };

}(window, jQuery));