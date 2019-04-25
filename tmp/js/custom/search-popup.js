$(function() {
  // $('.popup.popup-search-news').css('top',$('#filter').offset().top);
  $(document).on('click', '#search-input', function() {
    $('body').scrollTop(0);
    $.popup('.popup-search-news');
    if($.trim($(this).val()) == ""){
      $('#search-btn').html("取消");
    }
  });

  $(document).on('click', '#search-btn', function() {
    if ($.trim($('#search-btn').html()) == "取消") {
      if(typeof search_direct_url != "undefined"){
        window.location.href = search_direct_url;
      }else{
        history.go(-1);
      }
    } else {
      //执行搜索方法
      var s_val = $("#search-input").val();
      if(s_val.trim() == ""){
        $.toast('请输入搜索词');
      }else{
        window.location.href=search_url+s_val;
      }
    }
  });

  $('#search-input').keyup(function(e) {
    var code = e.keyCode || e.which;
    
    if (code === '13') {
      //执行搜索方法
    var s_val = $("#search-input").val();
    window.location.href = search_url+s_val;
    }
  });

  $('#search-input').on('input',function(e) {
    // var code = e.keyCode || e.which;
    //输入“enter”键
    toggleBtnText();
  });

  $(document).on('click','#search_list_url',function(){
     window.location.href = search_list_url;
  });

  function toggleBtnText(){
    if($.trim($('#search-input').val()) == ""){
      $('#search-btn').html("取消");
    }else{
      $('#search-btn').html("搜索");
    }
  }

  $('.popup-search-news').on('close', function(){
    toggleBtnText();
  });
});
