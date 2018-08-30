$(function(){
    init();
    // 左侧滚动条
    var LeftScroll;
    //设置一个全局变量接受左侧点击或者是默认的数据
    var Datas;
    function init(){
        sethtml();
        getcategories();
        eventList();
    }

    //设置点击事件
    function eventList(){
        $(".left").on("tap","li",function(){
            var index = $(this).data("index");
            // console.log(index);
            // 当点中哪一个的时候 哪一个就增加类名  其他就删除
            $(this).addClass("active").siblings().removeClass("active");
            // 点击这个的时候 滚动调滚动到顶部
            LeftScroll.scrollToElement(this);
            renderRight(index);
        })
    }

    // 发送ajax请求
    function getcategories(){
        $.get("categories",function(res){
            // console.log(res);
            var html = template("titleList",{data:res.data});
            $(".left ul").html(html);

            // iscroll滚动
            LeftScroll = new IScroll(".left");

            // 把后台发送过来的数据 搞个全局变量接受 下 放到一个函数中执行调用
            Datas = res.data;
            //当页面渲染时候 初始化是0  在这搞个0就好了
            renderRight(0);
        })
    }
    //设置个索引 方便传参
    function renderRight(index){
        // 主要是有三层  第一层是左边侧栏的标题  第二层是商品分类标题 第三层是商品品牌
              //直接把第二层的内容赋值给data
        var data = Datas[index].children;
        var html2 = template("goodsList",{data:data});
        $(".right").html(html2);

        /**
         * 给右侧分栏设置一个滚轮插件 
         * 设置上去没有效果 
         * 原因
         * 1可能是当设置上去的时候 图片可能没加载完成 没高度 导致效果没出来
         * 2 书写样式错误
         */
        // 尝试等图片加载完成后再插入滚轮插件
        var nums = $(".right img").length;
        console.log(nums);
        // 获取了图片标签的长度
        // 设置一个load事件 等他加载完成 
        $(".right img").on('load',function(){
            // console.log(123);
            //发现插件有效果了 但是执行了总共图片的数量 太耗费性能
            // 采取当每次家贼完成一张之后进行-- 直到等于0的时候再执行
            nums--;
            if(nums==0) {
                new IScroll(".right");
                // console.log('123');
            }
            
        })
        
    }

    //设置屏幕
    function sethtml(){  
    // 屏幕适配 
    // 基础值100
    var baseVal = 100;
    // 设计稿的宽度
    var pageset =  375;
    // 获取当前屏幕的宽度
    var screenWidth = document.querySelector("html").offsetWidth;
    // 运用公式  当前宽度 * 基础值  /设计稿的宽度
    var fz = screenWidth * baseVal / pageset ;
    document.querySelector("html").style.fontSize = fz +"px";
    }
    window.onresize = function () {
        sethtml();
      }
})