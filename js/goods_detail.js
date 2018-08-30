$(function () {
    init();
    var GoodsObj;

    function init() {
        getdetail();
        evenlist();
    }

    // 当点击这个加入购物车的时候判断有没有token 指令牌 如果没有的话 判断先登录获取到token
    /**
     * 1 加入购物车按钮 中发送ajax请求 看下能不能请求
     * 2 现在发送回来的是401  无效token 这个失败值 401 判断如果是401 无效token的话 要跳转到登录页面重新登录 获取到token值
     * 3  现在设置完token值之后把他从本地存储中拿出来
     * 4. 获取到商品数据 在获取商品详情信息的ajax中找个全局变量把他拷贝过来 后端中规定格式是info 名称 里面包含了很多而且获取的信息是对象 把他转化成字符串
     * 5. 把token是规定设置在请求行的   在ajax请求中设置一下   发送ajax请求
     * 6.  现在能获取到数据了 判断如果是200的话 就询问是否进入购物车页面  
     * 7.  每次跳去比较麻烦  把当前页面 保存起来 设置完成之后跳转到当前页面
     */
    function evenlist() {
        $(".add_btn").on("tap", function () {
            //  console.log(123);
            // 当从未挡路过 就在首页打开主页的话会提示token没有找到  先在这里判断 有没有找到userinfo 如果没有那就是没有登录的 
      if(!localStorage.getItem("userinfo")){
        //   那就是没有登录了
        mui.toast("请登录");
        // 保存当前地址
        sessionStorage.setItem("pageName", location.href);
        setTimeout(function(){
            location.href = "/pages/login.html";
        },1000)
        return;
      }

            // 选择必填的数据
            var obj = {
                cat_id: GoodsObj.cat_id,
                goods_id: GoodsObj.goods_id,
                goods_name: GoodsObj.goods_name,
                goods_number: GoodsObj.goods_number,
                goods_price: GoodsObj.goods_price,
                goods_weight: GoodsObj.goods_weight,
                goods_small_logo: GoodsObj.goods_small_logo
            };
            var token = JSON.parse(localStorage.getItem("userinfo")).token;
            $.ajax({
                url:"my/cart/add",
                type:"post",
                data:{info:JSON.stringify(obj)},
                headers:{
                    Authorization:token
                  },
                  success:function(res){
                      console.log(res);
                      if(res.meta.status==200){
                          mui.confirm("是否跳转到购物车页面","添加成功",["是","否"],function(etype){
                            // console.log(etype);
                            if(etype.index == 0){
                                setTimeout(function(){
                                    location.href = "/pages/cart.html"
                                },1000);
                            } else if(etype.index==1){

                            }
                          });
                      } else if (res.meta.status==401) {
                          mui.toast("未登录");
                          sessionStorage.setItem("pageName",location.href)
                          setTimeout(function(){
                            location.href = "/pages/login.html";
                          },1000)
                      }
                  }
            })
        })
    }
    // 发送ajax请求
    function getdetail() {
        $.get("goods/detail", {
            goods_id: $.getUrlvalue("goods_id")
        }, function (res) {
            // console.log(res);
            var html = template("temp", {
                data: res.data
            });
            // console.log(html);
            GoodsObj = res.data;
            $(".pyg_view").html(html);
            var gallery = mui('.mui-slider');
            gallery.slider({
                interval: 1000 //自动轮播周期，若为0则不自动播放，默认为0；
            });
        })
    }
})