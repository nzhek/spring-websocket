stompClient.connect({}, function (frame) {

    stompClient.subscribe('/topic/user', function (users) {
        var data = JSON.parse(users.body);
        if (data !== null && data.id === user_id) {
            showUserEdit(data.name);
            stompClient.send('/app/photos', {}, JSON.stringify({name: '', user_id: user_id}));
        }
    });

    stompClient.subscribe('/topic/photos', function (greeting) {
        var data = JSON.parse(greeting.body);
        if (data.length && data[0].user_id === user_id) {
            showGreeting(data);
        }
    });

    stompClient.subscribe('/topic/user/status/update', function (user) {
        var data = JSON.parse(user.body);
        if (data !== null && data.id === user_id) {
            $("#message").html("User update: " + user.body);
            if (data.name !== null) {
                stompClient.send("/app/users"); // обновляем список
            } else {
                $("#message").html("Error ... incorrect value");
            }
        }
    });

    stompClient.subscribe('/topic/user/delete', function (user) {
        var data = JSON.parse(user.body);
        if (data !== null && data.id === user_id) {
            $("#message").html("User delete with id: " + user.body.id);
            $('#main-content').html("User deleted");
        }
    });

    stompClient.subscribe('/topic/photo/delete', function (user) {
        stompClient.send('/app/photos', {}, JSON.stringify({name: '', user_id: user_id}));
    });

    stompClient.send('/app/user', {}, JSON.stringify({name: '', user_id: user_id}));

    stompClient.subscribe('/topic/photo', function (user) {
        var data = JSON.parse(user.body);
        if (data !== null && data.user !== null && data.user.id === user_id) {
            stompClient.send('/app/photos', {}, JSON.stringify({name: '', user_id: user_id}));
        }
    });

});

$(function () {
    $("#send_update_user").click(function () {
        stompClient.send("/app/user/update", {}, JSON.stringify({
            user_id: user_id,
            name: $("input[name='name']").val()
        }));
    });

    $("#send_image").click(function () {
        send_image();
    });

    $(document).on('click', '.photo-delete', function (e) {
        e.preventDefault();
        var photo_id = $(this).data('photo_id');
        stompClient.send("/app/photo/delete", {}, JSON.stringify({photo_id: photo_id}));
    });
});

function send_image() {
    var fileInput = $('#image')[0].files[0];
    $('#image').replaceWith($('#image').clone(true));

    getBase64(fileInput).then(function (res) {
        return {user_id: user_id, file: res};
    }).then(function (data) {
        stompClient.send("/app/photo/create", {}, JSON.stringify(data));
    });
}

function showGreeting(data) {
    $("#greetings").html("");
    $.each(data, function (k, o) {
        convertImgToDataURLviaCanvas(o.file, function (base64) {
            $("#greetings").append("<tr><td><div><img src='" + base64 + "'/></div><div><a class='photo-delete' href='#' data-photo_id='" + o.photo_id + "'>Удалить</a> </div></td></tr>");
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

function getBase64(file) {
    return new Promise(function (resolve, reject) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            resolve(reader.result);
        };
        reader.onerror = function (error) {
            reject(error)
        };
    });
}

function showUserEdit(user_name) {
    $("#name").val(user_name)
}