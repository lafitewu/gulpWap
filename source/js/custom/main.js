/*! Normalized address bar hiding for iOS & Android (c) @scottjehl MIT License */
(function(win) {
  var doc = win.document;

  // If there's a hash, or addEventListener is undefined, stop here
  if (!win.navigator.standalone && !location.hash && win.addEventListener) {

    //scroll to 1
    win.scrollTo(0, 1);
    var scrollTop = 1,
      getScrollTop = function() {
        return win.pageYOffset || doc.compatMode === "CSS1Compat" && doc.documentElement.scrollTop || doc.body.scrollTop || 0;
      },

      //reset to 0 on bodyready, if needed
      bodycheck = setInterval(function() {
        if (doc.body) {
          clearInterval(bodycheck);
          scrollTop = getScrollTop();
          win.scrollTo(0, scrollTop === 1 ? 0 : 1);
        }
      }, 15);

    win.addEventListener("load", function() {
      setTimeout(function() {
        //at load, if user hasn't scrolled more than 20 or so...
        if (getScrollTop() < 20) {
          //reset to hide addr bar at onload
          win.scrollTo(0, scrollTop === 1 ? 0 : 1);
        }
      }, 0);
    }, false);
  }
})(this);


$(function() {
  // $.init();
  FastClick.attach(document.body);
  if (template) {
    template.config('openTag', '<%');
    template.config('closeTag', '%>');
  }

  document.addEventListener('gesturestart', function(e) {
    e.preventDefault();
  });

  $(document).on('click', '#go-top-btn', function(e) {
    e.preventDefault();
    $(window).scrollTop(0);
  });

  $('.lazy').length && $('.lazy').lazyload({
    data_attribute: 'src',
    threshold: 200,
    container: $('body')
  });
});