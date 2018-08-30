$(function () {
    init();

    function init() {
        if (!$.checkLogin()) {
            mui.toast(" 请登录");
            $.setPage();
            location.href = "/pages/login.html";
            return;
        } else {
            $("body").fadeIn();
        }
        getall();
    }
    // 发送ajax请求
    function getall() {
        $.ajax({
            url: "my/orders/all",
            type: "get",
            data: {
                type: 1
            },
            headers: {
                Authorization: $.token()
            },
            success:function(res){
                console.log(res);
                var html= template("temp",{data:res.data});
                $("#item1 ul").html(html);
            }
        })
    }
})