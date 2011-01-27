(function (window, $) {

var SC = window.SC = {};

SC.log = function () {
    if (console) {
        console.log(arguments);
    }
};

SC.addToken = function (token) {
    var channel = new goog.appengine.Channel(token);
    var socket = channel.open();
    
    socket.onopen = function () {
    };
    socket.onmessage = function (m) {
      alert(m.data + "says hi!");
      SC.log(m.data);
    };
    socket.onerror = function () {
        alert('error');
    };
    socket.onclose = function () {};
    
    SC.socket = socket
};

$("#sc-test").click(function () {
    $.post('/chat', {msg: $("#current_user h2").text()}, function (ob) {
    }, 'json');
});

}(window, jQuery));