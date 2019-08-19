var socket = new SockJS('/gs-guide-websocket');
var stompClient = Stomp.over(socket);


$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
});
