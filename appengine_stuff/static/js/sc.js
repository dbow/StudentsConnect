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
    
    return '1';
    //return text;
}

$("#connect_form").submit(function (event) {
    var id = generateID();
    $("#uid").val(id);
});


var channel = new goog.appengine.Channel('{{ token }}'),
    socket = channel.open();
    
socket.onopen = function () {
};
socket.onmessage = function (data) {
    alert('hi');
    SC.log(data);
};
socket.onerror = function () {
    alert('error');
};
socket.onclose = function () {};

$("#sc-test").click(function () {
    $.post('/update', {}, function (ob) {
        SC.log(ob);
    }, 'json');
});

}(window, jQuery));