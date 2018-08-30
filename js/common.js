$(function () {

    var BaseUrl = " http://api.pyg.ak48.xyz/";
    //模板变量
    template.defaults.imports.iconUrl = BaseUrl;
    // 使用拦截器修改他的地址  变成缩写 方便以后后期修改或更改使用 
    // 增加一个加载中动画  利用zepto拦截器  每拦截一个请求就会加一个类名弹出遮罩层
    var ajaxNums = 0;
    $.ajaxSettings.beforeSend = function (xhr, obj) {
        // 每次发送请求之前都会截取下来  以obj的形式获取到请求地址  再拼接
        obj.url = BaseUrl + "api/public/v1/" + obj.url;
        ajaxNums++;
        // console.log("+");
        $("body").addClass("wait");
    }
    // 当数据返回时 
    $.ajaxSettings.complete = function () {
        // 每有数据回来一次调用一次  就--1次  最后判断是不是等于0  到0的时候判断
        ajaxNums--;
        if (ajaxNums == 0) {
            // console.log("-");
            $("body").removeClass("wait");
        }
    }
    // 使用扩展zepto封装对象 
    $.extend($, {
        getUrlvalue: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return decodeURI(r[2]);
            return null;
        },
        checkPhone: function (phone) {
            if (!(/^1[34578]\d{9}$/.test(phone))) {
                return false;
            } else {
                return true;
            }
        },
        checkEmail: function (myemail) {
            var myReg = /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/;
            if (myReg.test(myemail)) {　　　　
                return true;　　
            } else {　　　　
                return false;
            }
        },
        checkLogin: function () {
            // 使用这个对象返回 永久存储的用户信息
            return localStorage.getItem("userinfo");
        },
        token: function () {
            var token;
            if (!localStorage.getItem("userinfo")) {
                token = "";
            } else {
                token = JSON.parse(localStorage.getItem("userinfo")).token;
            }
            return token;
        },
        // 存储网址
        setPage: function(){
            sessionStorage.setItem("pageName",location.href);
        },
        // 取出网址
        getPage : function(){
            return sessionStorage.getItem("pageName");
        },
        // 本地存储用户
        setUser: function(obj){
            localStorage.setItem("userinfo",JSON.stringify(obj));
        },
        // 取出用户信息
        getUser: function(obj){
            return localStorage.getItem("userinfo")? JSON.parse(localStorage.getItem("userinfo")):false;
        },
        // 删除用户信息
        remUser: function(){
            localStorage.removeItem("userinfo");
        }

    });
})
