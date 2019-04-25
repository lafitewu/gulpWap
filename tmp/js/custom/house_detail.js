$(function(){
  var hdn = $(".housednav-swiper .swiper-wrapper").find("a").length;
  if(hdn == 2)
  {
    $(".housednav-swiper").attr("class","zz-free-swiper housednav-swiper swiper-container-horizontal swiper-container-free-mode col2");
  }
  else if(hdn == 3)
  {
    $(".housednav-swiper").attr("class","zz-free-swiper housednav-swiper swiper-container-horizontal swiper-container-free-mode col3");
  }
  else if(hdn == 4)
  {
    $(".housednav-swiper").attr("class","zz-free-swiper housednav-swiper swiper-container-horizontal swiper-container-free-mode col4");
  }
  else{
    $(".housednav-swiper").attr("class","zz-free-swiper housednav-swiper swiper-container-horizontal swiper-container-free-mode");
  }
});





// 详情页鼠标滚动效果
  $(window).on("scroll",function()
  {
    var t = $(window).scrollTop();
    var nav_t = $(".hose-d-cont").eq(0).offset().top;

    for(var x=0; x<$(".hose-d-cont").length; x++)
    {
      var cont_t = $(".hose-d-cont").eq(x).offset().top;
      if(t>=cont_t-50)
      {
        $(".housednav-swiper .swiper-wrapper").find("a").eq(x).addClass("active").siblings().removeClass("active");
      }
    };

    if(t >= nav_t-50){
      $(".housednav-swiper").css({
        "position":"fixed",
        "top": "0",
        "left": "0",
        "z-index": "999999"
      });
      $(".housednav-swiper").next(".height-2rem").attr("class","height-2rem show")
    }else{
      $(".housednav-swiper").css({
        "position":"static",
        "top": "",
        "left": "",
        "z-index": ""
      });
      $(".housednav-swiper").next(".height-2rem").attr("class","height-2rem hide")
    };

  });





  $(".housed-tab-swiper").find("a.swiper-slide").click(function()
  {
    $(this).addClass("active").siblings().removeClass("active");
  })