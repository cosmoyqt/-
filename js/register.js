$(function () {


    init();

    function init() {
        evencode();
        evenreg();
    }

    /**
     * 先点击验证码事件
     * 1 在点击的同时获得手机号码的输入值 清除两遍的空格 
     * 2再用正则判断手机是否合法 若正确则发送ajax请求
     * 3 发送ajax请求成功后  禁用点击功能 以免用户狂点
     * 4禁用后启动定时器 修改里面的文本多少秒后可 重新获取 到一定的时候 解除禁用  变回原来的文本
     * 5 如果不是的话就提示后台判断的结果文本
     */
    function evencode() {
        $("#code_btn").on('tap', function () {
            // console.log(123);
            var mobile_txt = $("[name='mobile']").val().trim();
            console.log(mobile_txt);
            if (!$.checkPhone(mobile_txt)) {
                // mui 提示框
                mui.toast("手机非法");
                return;
            }
            $.post("users/get_reg_code", {
                mobile: mobile_txt
            }, function (res) {
                // console.log(res);
                if (res.meta.status == 200) {
                    console.log(res.data);
                    //禁用点击
                    $("#code_btn").attr("disabled", "disabled");
                    // 设置一个定时器
                    var times = 5;
                    //同时设置按钮文本多少秒后再获取验证码
                    $("#code_btn").text(times + "秒后再获取");
                    var timeId = setInterval(function () {
                        times--;
                        $("#code_btn").text(times + "秒后再获取");
                        if (times == 0) {
                            clearInterval(timeId);
                            $("#code_btn").text("获取验证码");
                            $("#code_btn").removeAttr("disabled");
                        }
                    }, 1000);
                } else {
                    mui.toast(ret.meta.msg)
                }

            })
        })
    }

    /**
     * 点击注册按钮事件
     * 1.在点击的时候获取到form表单中的所有name属性 并去除两遍的空格
     * 2. 获取到所有的值 先在js代码中朱行判断是不是合法 
     * 3.判断完之后 到最后就是以post方式提交这些表单属性
     */
    function evenreg(){

        $("#btn-zc").on("tap",function(){
            // console.log('123');
            var mobile_txt = $("[name='mobile']").val().trim();
            var code_txt = $("[name='code']").val().trim();
            var email_txt = $("[name='email']").val().trim();
            var pwd_txt = $("[name='pwd']").val().trim();
            var pwd2_txt = $("[name='pwd2']").val().trim();
            var gender_txt = $("[name='gender']:checked").val().trim();
            // console.log(pwd2_txt);
            // console.log(gender_txt);
            // 1.第一个先判断手机号码是否合法
            if(!$.checkPhone(mobile_txt)){
                //如果不合法就提示
                mui.toast("手机不合法");
                return;
            }
            // 2.在这判断验证码是不是长度为4 不等于4或大于则为错误  因为前端无法判断验证码 只能提交到后台让后端判断
            if(code_txt.length!=4){
                mui.toast("验证码不符");
                return;
            }
            // 3判断邮箱 使用正则 是否符合
            if(!$.checkEmail(email_txt)){
                //如果不合法就提示
                mui.toast("邮箱不合法");
                return;
            }
            //4判断密码如果小于6位就是非法
            if(pwd_txt.length<6){
                //如果不合法就提示
                mui.toast("密码不合法");
                return;
            }
            // 5 再次判断密码就判断是不是相同就好了
            if(pwd_txt!=pwd2_txt){
                mui.toast("密码不一致");
                return;
            }

            // 发送ajax
            $.post("users/reg",{
                mobile:mobile_txt,
                code:code_txt,
                email:email_txt,
                pwd:pwd_txt,
                gender:gender_txt
            },
            //如果返回来的值是等于两百的话 则跳到登录页面
            function(res){
                if(res.meta.status==200){
                    mui.toast(res.meta.msg);
                    // 设置一个延时器  延迟一秒跳转到登录页面上
                    setTimeout(function(){
                        location.href = "/pages/login.html";
                    },1000);
                } else {
                    mui.toast(res.meta.msg);
                }
            }
        )

        })
    }


    /**
     *    
     // 突然发现这个判断正则在其他页面也要用到  把他在公共样式中封装起来 方便调用
    function checkPhone(phone) {
        if (!(/^1[34578]\d{9}$/.test(phone))) {
            return false;
        } else {
            return true;
        }
    }
     */
})