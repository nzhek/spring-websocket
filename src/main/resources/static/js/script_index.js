stompClient.connect({}, function (frame) {
    // получить всех пользователей page_index
    stompClient.subscribe('/topic/users', function (users) {
        var data = JSON.parse(users.body);
        console.log(data);
        showUsers(data);
    });

    stompClient.subscribe('/topic/user/delete', function (user) {
        var data = JSON.parse(user.body);
        if (user.body !== null) {
            $("#message").html("User delete with id: " + user.body.id);
            stompClient.send("/app/users");
        }
    });

    stompClient.send("/app/users");

});

function showUsers(users) {
    $("#users").html("");
    $.each(users, function (k, o) {
        appendUser(o);
    });

    $("#users_paging").html("1,2,3,4,5");
}

function appendUser(o) {
    $("#users").append("<p><a href='/users/" + o.id + "'>" + o.name + "</a>  - <a href='#' class='remove' data-id='" + o.id + "'>Удал.</a> <a href='/users/" + o.id + "/edit'>Ред</a> </p>");
}


$(function () {
    $(document).on("click", ".remove", function (e) {
        e.preventDefault();

        var user_id = $(this).data("id");
        stompClient.send("/app/user/delete", {}, JSON.stringify({
            name: $("input[name='name']").val(),
            user_id: user_id
        }));
    });
});