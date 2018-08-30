 $(function(){
  /**
   * 用mui框架中的上拉加载 下拉刷新来完成
   * 同时这个api 要传四个参数
   * 先获取到请求行中的数据
   */
  var QueryObj = {
    quert:"",
    cid:$.getUrlvalue("cid"),
    pagenum:1,   //当前页面
    pagesize: 6 //每页显示多少条数据
  }
  //设置总页数
  var totalPage = 1;
  /**
   * 利用miu框架中的上拉加载更多 下拉刷新来完成数据的迭代
   * 第一步 在下拉刷新回调函数中发送ajax请求 这时候的问题时更新完成时 家贼动画没取消
   * 1.1 在ajax的封装函数中放入回调函数 让ajax变成一个方法 执行加载完成之后关闭下拉动画
   * 1.2 发现上拉刷新时 继续追加了同样的页数内容 应当只追加第一页 或者是最新的东西  清空默认值
   * 1.3 发现下拉的时候  显示到了最后一页面的页面 没有返回到第一面 要在下拉刷新设置回到第一面
   * 1.4  上拉加载 拉到底部  再下拉刷新 发现 上拉的没有数据还依然在  要重置组件
   * 
   */
  init();
  function init(){
    evenboom();
    mui.init({
      pullRefresh: {
        container: ".pyg_view",
        down: {
          auto: true,
          //  触发下拉刷新时自动触发
          callback: function () {
            $(".pyg_view ul").html("");
            QueryObj.pagenum=1;
            search(function(){
              mui('.pyg_view').pullRefresh().endPulldownToRefresh();
              mui('.pyg_view').pullRefresh().refresh(true);
            });
          }
        },
        up:{
          //  触发上拉刷新时自动触发
          /**
           * 上拉加载更多 
           * 第一步是发送ajax请求 发现请求回来的数据是直接把他覆盖了 不能用html（）。这种方式只能用append方式追加 
           * 1.1 加载完成时关闭动画
           * 1.2发现上拉加载的时候 家贼了同样的东西  原因是他加载时页面还是在刚开始时的第一面  每上拉一次页面就++ 
           * 1.3拉到最后没有提示页底提示 加个判断 如果是到底部了就retuan返回值 没有数据了  
           *        利用四个输入值来判断 获取回来的有多少条数据 分成如需求一样6条的话 总共有多少页 当上拉加载时的页数比总页数还大就返回提示
           * 1.4利用mui框架有一个属性可以mui('.pyg_view').pullRefresh().endPullupToRefresh(true); 提示到页面中
           */
          callback:function () {
            if(QueryObj.pagenum>=totalPage){
              console.log('没有数据了 不再操作');
              mui('.pyg_view').pullRefresh().endPullupToRefresh(true);
              return ;
            } else{
              QueryObj.pagenum++;
            search(function(){
              mui('.pyg_view').pullRefresh().endPullupToRefresh();
            });
            }
            
          }
        }
      }
    });
  }

  // 封装一个ajax请求
  function search(callback){
    //把商品刷选条件放到ajax中当作data传到后台中判断
    $.get("goods/search",QueryObj,function(res){
      console.log(res);
      totalPage = Math.ceil(res.data.total/QueryObj.pagesize);
      console.log('总页数'+ totalPage);
      var html=template("temp",{data:res.data.goods});
      $(".pyg_view ul").append(html);
      callback&&callback();
    })
  }

  // 因为muii框架 加装上拉下拉刷新 默认是不需要a标签跳转的   只能在js中 利用tap点击获取他的属性值跳转
  function evenboom(){
    $(".pyg_view").on("tap","a",function(){
      var href = this.href;
      // console.log(href);
      location.href = href;
    })
  }
 })