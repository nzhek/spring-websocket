stompClient.connect({}, function (frame) {

    stompClient.subscribe('/topic/user/new', function (user) {
        var data = JSON.parse(user.body);
        console.log(data);
        $("#message").html("Success user created: " + user.body);
        if (data.name !== null) {
            stompClient.send("/app/users");
            $("input[name=name]").val("");
        } else {
            $("#message").html("Error ... incorrect value");
        }

    });

});

$(function () {
    // create user
    $("#create").click(function () {
        stompClient.send("/app/user/create", {}, JSON.stringify({name: $("input[name='name']").val()}));
    });
});