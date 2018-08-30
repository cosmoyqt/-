$(function () {
    init();

    // 把所有需要执行的函数都放在这里 
    function init() {
        getswiperdata();
        getcatitems();
        getGoodslist();
    }

    //获取轮播图数据
    function getswiperdata() {
        $.get("home/swiperdata", function (res) {
            // console.log(res);
            var html = template("lunboList", {
                data: res.data
            });
            $(".mui-slider").html(html);
            // 轮播图
            //获得slider插件对象
            var gallery = mui('.mui-slider');
            gallery.slider({
                interval: 1000 //自动轮播周期，若为0则不自动播放，默认为0；
            });
        })
    }

    // 获取首页导航栏信息
    function getcatitems(){
        $.get("home/catitems",function(res){
            // console.log(res);
            var html = template("navList",{data:res.data});
            $(".index_nav").html(html);
        })
    }

    // 获取首页商品详情
    function getGoodslist(){
        $.get("home/goodslist",function(res){
            console.log(res);
            var html = template("goodsList",{data:res.data});
            $(".index_goodsList").html(html);
        })
    }

})