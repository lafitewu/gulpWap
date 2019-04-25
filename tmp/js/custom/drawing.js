// 找图纸筛选
$(".li-1").click(function()
{
  $(this).addClass("active").siblings(".li-1").removeClass("active")
});
$(".li-2").click(function()
{
  var m_class = $(this).attr("class");
  var n = $(this).index();

  $(this).addClass("active").siblings(".li-2").removeClass("active");

  //点击添加or删除样式
  if(m_class=="li-2 active")
  {
    $(this).attr("class","li-2");

  }else{
    $(this).attr("class","li-2 active");
  };

  //点击头两个时，隐藏子内容选择
  if(n == 0 || n == 1)
  {
    $(".con-filter").find(".con-filter-child").hide();
  }

});

$(".li-tiaojian").click(function ()
{
  var i=$(".li-tiaojian").index($(this));

  //显示active对应的子内容选择框，并隐藏其他内容框
  $(".con-filter").find(".con-filter-child").eq(i).show().siblings().hide();

  if($(this).parent("li").attr("class") == "active")
  {
    $(".con-filter").find(".con-filter-child").hide();
  }
  else{
    $(".con-filter").find(".con-filter-child").eq(i).show();
  }
});

// 分类、风格-点击筛选条件公用方法
function createFilters(con,c_type)
{
  this.con = con;
  this.c_type = c_type;

  $(con).find(".col-33").click(function()
  {
    $(this).addClass("active").siblings().removeClass("active");

    var a_txt = $(this).find("a").text(); //当前所点击标签的文字内容
    // alert(a_txt)
    var c_txt = '<a data-type=\"'+ c_type +'\">'+ a_txt +'</a>';
    $(".checked-tag").append(c_txt);

    $(".drawing-find-checked").removeClass("hide");

    var tag_a = $(".checked-tag").find('a[data-type="'+ c_type +'"]'); //data-type属性为c_type的a元素
    if(tag_a) //当已存在data-type属性为c_type的a元素时
    {
      $('a[data-type="'+ c_type +'"]').remove();
      $(".checked-tag").append(c_txt);
    };

    // $(con).hide(); //分类隐藏
    // $(con).find(".col-33").removeClass("active"); //内容标签-恢复默认
    $(".drawing-find-checked").show();
    $(".nav-filter").find("li-2").removeClass("active"); //标题标签-恢复默认

    if($(con).parents().attr("class") == "con-filter-child con-gengduo") //点击更多时
    {
      $(con).show();
      $(con).parent(".con-gengduo").show();

      $(".nav-filter").find("li").eq(4).attr("class","active");

      $(".btn-confirm").click(function()
      {
        $(con).parent(".con-gengduo").hide();
        $(".nav-filter").find("li").eq(4).attr("class","");
      });
    }
    else{
      $(con).hide(); //分类隐藏
    }
  })
}

$(".con-fenlei col-33").on("click", createFilters(".con-fenlei","classify"));
$(".con-fenlei col-33").on("click", createFilters(".con-fengge","style"));
$(".con-fenlei col-33").on("click", createFilters(".con-filter-child-mianji","area"));
$(".con-fenlei col-33").on("click", createFilters(".con-filter-child-zaojia","pirce"));







//删掉已选标签时，相对应的清空条件选择框里的样式
$(".checked-tag").on("click", "a", function()
{
  var t_type = $(this).attr("data-type");

  function tag_a(tag_class, tag_type)
  {
    if(t_type == tag_type)
    {
      $(tag_class).find(".col-33").removeClass("active");
    }
  }

  tag_a(".con-fenlei", "classify");
  tag_a(".con-fengge","style");
  tag_a(".con-filter-child-mianji","area");
  tag_a(".con-filter-child-zaojia","pirce");

  $(this).remove();
  if($(".checked-tag a").length == 0)
  {
    clearall();
  }
});





//已选择条件清除
function clearall()
{
  $(".drawing-find-checked").hide();
  $(".con-filter-child").find(".col-33").removeClass("active"); //内容标签-恢复默认
};

$(".a-clearall").click(function()
{
  $(".checked-tag a").remove();
  clearall();
})








