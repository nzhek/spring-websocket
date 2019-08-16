var stompClient = null;

connect();


$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $("#connect").click(function () {
        connect();
    });
    $("#disconnect").click(function () {
        disconnect();
    });
    //
    $("#update_user").click(function () {
        // send();
        stompClient.send("/app/users");
    });
    // create user
    $("#create").click(function () {
        stompClient.send("/app/user/create",{}, JSON.stringify({name: $("input[name='name']").val()}));
    });

    $(document).on("click", ".remove", function (e) {
        e.preventDefault();

        var user_id = $(this).data("id");
        stompClient.send("/app/user/delete",{}, JSON.stringify({name: $("input[name='name']").val(), user_id: user_id}));
    });

    $("#send_update_user").click(function () {
        // send();
        send_update_user();
    });

    $("#send_image").click(function () {
        // send();
        send_image();
    });
});


function connect() {
    var socket = new SockJS('/gs-guide-websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        console.log('Connected: ' + frame);

        stompClient.subscribe('/topic/photo', function (greeting) {
            var data = JSON.parse(greeting.body);
            showGreeting(data.user_id, data.file);
        });

        // вывести информацию по пользователю page_detail
        stompClient.subscribe('/topic/user', function (users) {
            var data = JSON.parse(users.body);
            showUserDetail(data);
        });
        stompClient.send('/app/user', {} , JSON.stringify({name: '', user_id: user_id}));
        // --

        // получить всех пользователей page_index
        stompClient.subscribe('/topic/users', function (users) {
            var data = JSON.parse(users.body);
            console.log(data);
            showUsers(data);
        });
        // --

        // page_create
        stompClient.subscribe('/topic/user/new', function (user) {
            var data = JSON.parse(user.body);
            console.log(data);
            $("#message").html("User update: "+ user.body)
            appendUser(data);
        });
        //--

        // page_edit, page_detail, page_index
        stompClient.subscribe('/topic/user/status/update', function (user) {
            var data = JSON.parse(user.body);
            $("#message").html("User update: "+ user.body)
        });
        // --


        // следит за удалением юзеров, если удалили тогда запрос на обновление данных page_edit, page_detail, page_index
        stompClient.subscribe('/topic/user/delete', function (user) {
            var data = JSON.parse(user.body);
            if (user.body !== null) {
                $("#message").html("User delete with id: " + user.body.id);
                stompClient.send("/app/users");
            }
        });

    });
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    } else {
        $("#conversation").hide();
    }
    $("#greetings").html("");
}

function showGreeting(user_id, image) {
    convertImgToDataURLviaCanvas(image, function (base64) {
        $("#greetings").append("<tr><td><div>user_id: " + user_id + "</div><div><img src='" + base64 + "'/></div></td></tr>");
    });
}

function showUserDetail(data) {
    console.log(data);
    $("#detail_info").html("<pre>User id: "+data.id+"<br>Name: "+data.name+"</pre>")
}

function showUsers(users) {
    $("#users").html("");
    $.each(users, function (k, o) {
        appendUser(o);
    });

    $("#users_paging").html("1,2,3,4,5");
}

function appendUser(o) {
    $("#users").append("<p><a href='/users/" + o.id + "'>" + o.name + "</a>  - <a href='#' class='remove' data-id='"+o.id+"'>Удал.</a> <a href='/users/" + o.id + "/edit'>Ред</a> </p>");
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

function send_update_user() {
    stompClient.send("/app/user/update", {}, JSON.stringify({name: $("input[name='name']").val()}));
}

function send_image() {
    var fileInput = $('#image')[0].files[0];
    $('#image').replaceWith($('#image').clone(true));

    getBase64(fileInput).then(function (res) {
        return {user_id: $("#user_id").val(), file: res};
    }).then(function (data) {
        stompClient.send("/app/photo/create", {}, JSON.stringify(data));
    });
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
