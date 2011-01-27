(function (window, $) {

var SC = window.SC = {};

SC.log = function () {
    if (console) {
        console.log(arguments);
    }
};

function generateID() {
    var text = "",
        possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        
    for (var i=0; i < 5; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    
    return '2';
    //return text;
}

$("#connect_form").submit(function (event) {
    var id = generateID();
    $("#uid").val(id);
});

var channel, socket;

SC.socket = socket;

SC.addToken = function (token) {
    channel = new goog.appengine.Channel(token);
    socket = channel.open();
    
    socket.onopen = function () {
    };
    socket.onmessage = function (data) {
        SC.log(data);
    };
    socket.onerror = function () {
        alert('error');
    };
    socket.onclose = function () {};
};

$("#sc-test").click(function () {
    $.post('/update', {msg: $("input").val()}, function (ob) {
    }, 'json');
});

}(window, jQuery));