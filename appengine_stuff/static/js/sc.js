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
    
    return text;
}

$("#connect_form").submit(function (event) {
    var id = generateID();
    $("#uid").val(id);
});

}(window, jQuery));