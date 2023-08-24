$(document).ready(function () {
    console.log("ready");
    $("#loginform").submit(function(event) {
        event.preventDefault();
        ajaxPost();
    });

    function ajaxPost() {
        var formData = {
            email: $("#email").val(),
            password: $("#password").val()
        };
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: window.location + "api/login",
            data: JSON.stringify(formData),
            dataType: 'json',
            success: function (customer) {
                if (customer.valid == true) {
                    //window.location.href = '/test.html';
                } else {
                    $("#loginform").removeClass("success");
                    $("#loginform").addClass("fail");
                }
                $("#postResultDiv").html("<p>" + "Post Successfully! <br>" + "Email Address: " + customer.email + "</br>" +
                    "Password" + customer.password + "</br>" + "Valid User:" + customer.valid + "</p>");

                // Reset FormData after Posting
                resetData();
            },
            error: function (e) {
                alert("Error!");
                console.log("ERROR:", e);
            }
        });
    }

    function resetData() {
        $("#email").val("");
        $("#password").val("");
    }
});
