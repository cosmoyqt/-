$(function () {
    evenlist();

    function evenlist() {
        $("#btn_1").on("tap", function () {
            var user_txt = $("[name='username']").val().trim();
            var pwd_txt = $("[name='pwd']").val().trim();

            //因为他是用手机号码注册的 用手机号码判断
            if (!$.checkPhone(user_txt)) {
                mui.toast("手机不合法");
                return;
            }
            // 判断密码长度不少于6
            if (pwd_txt.length < 6) {
                mui.toast("密码不合法");
                return;
            }
            $.post("login", {
                username: user_txt,
                password: pwd_txt
            }, function (res) {
                if (res.meta.status == 200) {
                    mui.toast(res.meta.msg);
                    // 在跳转到首页
                    // 在这log 能看到token值还有其他个人信息
                    // 都把他存入到永久存储中   但是他现在是一个对象 要把他转换为字符串才可以存到本地存储 以免数据丢失
                    // console.log(res);
                    localStorage.setItem("userinfo", JSON.stringify(res.data));
                    setTimeout(function () {
                        // 存储完成之后看下有没有来源页如果有来源页的话就跳到来源页没有就跳转到首页
                        var pageName = sessionStorage.getItem("pageName");
                        if(pageName){
                            location.href = pageName;
                        } else{
                            location.href = "/index.html";
                        }
                    }, 1000);
                } else {
                    mui.toast(res.meta.msg);
                }
            })
        })
    }
})