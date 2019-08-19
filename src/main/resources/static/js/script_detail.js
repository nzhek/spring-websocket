stompClient.connect({}, function (frame) {

    stompClient.subscribe('/topic/user', function (users) {
        var data = JSON.parse(users.body);
        if (data !== null && data.id === user_id) {
            showUserDetail(data);
            stompClient.send('/app/photos', {}, JSON.stringify({name: '', user_id: user_id}));
        }
    });
    stompClient.send('/app/user', {}, JSON.stringify({name: '', user_id: user_id}));

    stompClient.subscribe('/topic/user/delete', function (user) {
        var data = JSON.parse(user.body);
        if (data !== null && data.id === user_id) {
            $("#message").html("User delete with id: " + data.id);
            $('#detail_info').html('User deleted');
            $('#main-content').html('');
        }
    });

    stompClient.subscribe('/topic/user/status/update', function (user) {
        var data = JSON.parse(user.body);
        if (data !== undefined && data.id === user_id) {
            showUserDetail(data);
        }
    });

    stompClient.subscribe('/topic/photos', function (greeting) {
        var data = JSON.parse(greeting.body);
        if (data.length && data[0].user_id === user_id) {
            showGreeting(data);
        }
    });

});

function showUserDetail(data) {
    console.log(data);
    $("#detail_info").html("<pre>User id: " + data.id + "<br>Name: " + data.name + "</pre>")
}

// сюда же вывести фотографии
function showGreeting(data) {
    $("#greetings").html("");
    $.each(data, function (k, o) {
        convertImgToDataURLviaCanvas(o.file, function (base64) {
            $("#greetings").append("<tr><td><div><img src='" + base64 + "'/></div></td></tr>");
        });
    });
}

function convertImgToDataURLviaCanvas(url, callback, outputFormat) {
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function () {
        var canvas = document.createElement('CANVAS');
        var ctx = canvas.getContext('2d');
        var dataURL;
        canvas.height = this.height;
        canvas.width = this.width;
        ctx.drawImage(this, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
        callback(dataURL);
        canvas = null;
    };
    img.src = url;
}
