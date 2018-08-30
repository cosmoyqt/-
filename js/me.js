$(function(){
    init();
    function init(){
        if(!$.checkLogin()){
            $.setPage();
            location.href = "/pages/login.html";
            return;
        } else{
            $("body").fadeIn();
        }
        getUser();
        even();
    }

    // 获取用户信息
    function getUser(){
        $.ajax({
            url:"my/users/userinfo",
            type:"get",
            headers:{
                Authorization: $.token()
            },
            success:function(res){
                console.log(res);
                if(res.meta.status==200){
                    var html = template("temp",{data:res.data});
                    $(".uinf").html(html);
                } else{
                    mui.toast(res.meta.msg);
                }
            }
        })
    }
    // 退出登录
    function even(){
        $(".mui-btn").on('tap',function(){
            // 当点击这个的时候弹出一个警告框 
            mui.confirm("确定要退出吗？","提示",["确定","取消"],function(etype){
                if(etype.index==0){
                    $.remUser();
                    $.setPage();
                } else if(etype.index==1){

                }
            })

        })
    }
})