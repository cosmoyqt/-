$(function () {
    init();

    function init() {
        if (!$.checkLogin()) {
            $.setPage();
            location.href = "/pages/login.html";
            console.log('123');
            return;
        } else {
            $("body").fadeIn();
        }
        getCart();
        evenlist();

    }

    // 事件
    function evenlist() {
        // 点击数字输入器 上下
        $(".pyg_view").on("tap", "button", function () {
            getall();
        })
        //点击编辑时显示
        $("#btnone").on("tap", function () {
            $("body").toggleClass("edit_status");
            if ($("body").hasClass("edit_status")) {
                $("#btnone").text("完成");
            } else {
                $("#btnone").text("编辑");
                //更新数量
                var lis = $('.gg_content li');
                if (lis.length == 0) {
                    mui.toast('你尚未购买东西');
                    return;
                }
                var infos = {};
                for (var i = 0; i < lis.length; i++) {
                    var li = lis[i];
                    var obj = $(li).data('obj');
                    obj.amount = $(li).find(".mui-numbox-input").val();
                    infos[obj.goods_id] = obj;
                }
                synccart(infos);
            }
        })
        /**
         * 删除功能
         * 首先点击这个功能的时候先获得选中的标签
         * 判断有没有选中如果没有选中就提示
         * 获取到没有选中的参数  
         * 循环
         */
        $("#deletabtn").on("tap", function () {
            // 先获得选中的标签
            var checkbox = $(".gg_content [name='c_box']:checked");
            if (checkbox.length == 0) {
                mui.toast("你未选中东西");
                return;
            }
            // 先弹出一个警告框  问下是否删除 执行是否的动作
            mui.confirm('是否删除', '标题', ['确定', '取消'], function (ertpe) {
                if (ertpe.index == 0) {
                    //获取没有选中的父元素
                    var unSelectLis = $(".gg_content [name='c_box']").not(':checked').parents('li');
                    console.log(unSelectLis);
                    // 
                    var infos = {};
                    for (var i = 0; i < unSelectLis.length; i++) {
                        var lis = unSelectLis[i];
                        var obj = $(lis).data('obj');
                        // 把这个存入到infos里面中
                        infos[obj.goods_id] = obj;
                        // console.log(infos);
                        // 把这个同步
                    }
                    synccart(infos);
                } else if (ertpe.index == 1) {

                }
            })

        })
        //生成订单
        //看文档需求  要写地址 
        $("#addbtn").on('tap', function () {
            //先获取到所有li
            var lis = $(".gg_content li");
            if (lis.length == 0) {
                mui.toast('你的购物车没有订单');
                return;
            }
            // 根据文档的参数
            var paramsObj = {
                "order_price": 5,
                "consignee_addr": "你心理",
                "goods": []
            }
            //循环li 把剩余的参数传进去
            for (var i = 0; i < lis.length; i++) {
                var li = lis[i];
                var obj = $(li).data('obj');
                var temp = {
                    "goods_id": obj.goods_id,
                    "goods_number": $(li).find(".mui-numbox-input").val(),
                    "goods_price": obj.goods_price
                }
                paramsObj.goods.push(temp);
            }
            addbuiui(paramsObj);

        })
    }

    //获得购物车信息数据
    function getCart() {
        $.ajax({
            url: "my/cart/all",
            type: "get",
            headers: {
                Authorization: $.token()
            },
            success: function (res) {
                // console.log(res);
                if (res.meta.status == 200) {
                    var html = template("temp", {
                        data: JSON.parse(res.data.cart_info)
                    });
                    $(".gg_content ul").html(html);
                    // 重置数字器
                    mui(".mui-numbox").numbox();
                    getall();
                } else {
                    mui.toast(res.meta.msg);
                    location.href = "/pages/login.html";
                }
            }
        })
    }
    //计算总价
    function getall() {
        // 先设置一个总价格
        var totle = 0;
        //获得所有的li标签
        var lis = $(".gg_content li");
        for (var i = 0; i < lis.length; i++) {
            var li = lis[i];
            var obj = $(li).data("obj");
            //每次把li的单价剩余数量  要获得单价 和数量
            var nums = $(li).find(".mui-numbox-input").val();
            var goods_price = obj.goods_price;
            totle += goods_price * nums;
        }

        $(".money").text(totle);
    }
    // 同步购物车
    function synccart(infos) {
        $.ajax({
            url: 'my/cart/sync',
            type: 'post',
            data: {
                infos: JSON.stringify(infos)
            },
            headers: {
                Authorization: $.token()
            },
            success: function (res) {
                // console.log(res);
                if (res.meta.status == 200) {
                    mui.toast(res.meta.msg);
                    getCart();
                } else {
                    mui.toast(res.meta.msg)
                }
            }

        })
    }
    //生成订单
    function addbuiui(paramsObj) {
        $.ajax({
            url: 'my/orders/create',
            type: 'post',
            data: paramsObj,
            headers: {
                Authorization: $.token()
            },
            success: function (res) {
                // console.log(res);
                if (res.meta.status == 200) {
                    mui.toast(res.meta.msg);
                    getCart();
                } else {
                    mui.toast(res.meta.msg)
                }
            }
        })
    }
})