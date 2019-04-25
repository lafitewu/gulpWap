(function(factory) {
  if (typeof define === "function" && define.amd) {
    define(["zepto"], factory);
  } else if (typeof exports === 'object') {
    factory(require('zepto'));
  } else {
    factory(Zepto);
  }
}(function($, undefined) {

  var defaults = {
    ajax_url: "",
    maxPage: 10,
    page_size: 10,
    dataType: 'json',
    type: 'GET',
    rsStatus: '200',
    templateId: 'list-template',
    callback: null,
    pageobj_key: 'page_number',
    data: {},
    status_key: 'code',
    list_key: 'data',
    scroll_to_offset: 50,
    preventDefault: true,
    empty_placeholder: '暂时还没有结果哦，您可以搜索别的条件试试'
  };

  var loading = false;
  var botDetached = false;
  var positionInited = false;
  var page = 1;
  var timer = false;
  var curPage = page;
  var topDetached = false;
  var pos, scrollHeight;

  /**
   * Constructor function
   */
  function ListScroll(element, options) {
    $(element).data('listscroll', this);
    this.$element = $(element);
    this.settings = $.extend(true, {}, defaults, options);
    this.build();
  }

  ListScroll.prototype = {
    constructor: ListScroll,
    build: function() {
      var self = this;
      self.inifiLandsScroll = {};
      if (self.settings.preventDefault) {
        $(self.settings.innerWrapClass).on('click', 'a', function(e) {
          e.preventDefault();
          var obj = {
            page: $(this).attr('page'),
            pos: $(this).attr('pos')
          };
          var path = '#page=' + $(this).attr("page") + '&pos=' + $(this).attr('pos');
          if (history.state) {
            history.replaceState(obj, null, path);
          } else {
            history.pushState(obj, null, path);
          }
          location.href = $(this).attr('href');
        });
      }

      if ($(self.settings.innerWrapClass + ' ul').length) {
        $(self.settings.innerWrapClass + ' ul').empty();
        if (history.state) {
          var stateObj = history.state;
          curPage = page = parseInt(stateObj.page);
          pos = parseInt(stateObj.pos);
          //默认加载上一次访问的一页数据
          self.addItems(curPage, "top");
          //页面滑动到指定位置
          positionInited = false;
        } else {
          // addItems(page, "bottom");
          self.addItems(page, "bottom");
        }
      }

      setTimeout(function() {
        self.inifiLandsScroll = $(window).endlessScroll({
          innerWrapClass: self.settings.innerWrapClass,
          callback: function(i, p, d) {
            // console.log(i, p, d);
            if (d == "next") {
              self.inifiLandsScroll.firing = false;
              if (botDetached) return;
              // 如果正在加载，则退出
              if (loading) return;

              loading = true;
              // 模拟1s的加载过程
              // 重置加载flag
              if (self.settings.maxPage && page >= self.settings.maxPage) {
                // 加载完毕，则注销无限加载事件，以防不必要的加载
                // $.detachInfiniteScroll($('.infinite-scroll'));
                // 删除加载提示符
                botDetached = true;
                $(self.settings.innerWrapClass + " new-load-more-btn").html('加载完成');
                self.inifiLandsScroll.firing = false;
                return;
              }
              page++;
              // 添加新条目
              //addItems(page, "bottom");
              self.addItems(page, "bottom");
              //容器发生改变,如果是js滚动，需要刷新滚动
              loading = false;
            } else {
              if (curPage > 1) {
                if (topDetached) return;
                var scroller = $('body');
                scrollHeight = scroller[0].scrollHeight; // 获取当前滚动元素的高度
                // if (timer) return;
                // timer = true;
                if (curPage <= 1) {
                  topDetached = true;
                  //$('.list-block').find('.com-more-top').html('已经是第一页');
                  return;
                }
                curPage--;
                // 添加新条目
                //addItems(curPage, "top");
                self.addItems(curPage, "top");
              }
            }
          },
          fireOnce: false,
          fireDelay: false,
          insertAfter: self.settings.insertAfter,
          loader: '加载中...',
          ceaseFireOnEmpty: false,
          // intervalFrequency: 500,
          inflowPixels: 90
        });
      }, 500);
    },

    addItems: function(pageNum, dir) {
      var self = this;
      var pageObj = {};
      pageObj[self.settings.pageobj_key] = pageNum;
      var data = $.extend(true, {}, self.settings.data, pageObj);
      self.inifiLandsScroll.firing = false;
      $.ajax({
        url: self.settings.ajax_url,
        type: self.settings.type,
        dataType: self.settings.dataType,
        data: data,
        success: function(rs) {
          if (rs[self.settings.status_key] == self.settings.rsStatus) {
            var listdata = {};
            listdata.page_num = pageNum;
            listdata.page_size = self.settings.page_size;
            listdata.data = rs[self.settings.list_key].list || rs[self.settings.list_key];
            if (listdata.data.datas && listdata.data.datas.length === 0 && pageNum == 1) {
              var emptyDom = $('<div class="hh-no-info">' + self.settings.empty_placeholder + '</div>');
              $(self.settings.innerWrapClass).html(emptyDom);
              return;
            }
            if (pageNum >= parseInt(self.settings.maxPage)) {
              $(self.settings.innerWrapClass + ' .new-load-more-btn').html('<span class="hh-text">加载完成</span>');
            }
            var htmlStr = template(self.settings.templateId, { list: listdata });
            if (dir && dir == "top") {
              $(self.settings.innerWrapClass + ' ul').prepend(htmlStr);
            } else {
              $(self.settings.innerWrapClass + ' ul').append(htmlStr);
            }

            $('.lazy').length && $('.lazy').lazyload({
              data_attribute: 'src',
              threshold: 200
            });

            self.getListCallback(dir, self.settings.scroll_to_offset);

            if (self.settings.callback) {
              self.settings.callback();
            }

            // $.refreshScroller();
            self.inifiLandsScroll.firing = true;
          }
        },
        error: function(msg) {
          console.log(msg);
        }
      });
    },

    getListCallback: function(dir, cusoffset) {
      // 添加新条目
      var self = this;
      var scroller = $('body');
      if (dir && dir == "top") {

        // 将滚动条的位置设置为最新滚动元素高度和之前的高度差
        if (!positionInited) {
          positionInited = true;
          var offset = cusoffset ? cusoffset : 120;
          if ($(self.settings.innerWrapClass + ' ul li').length) {
            var posIndex = pos - (curPage - 1) * parseInt(self.settings.page_size);
            scroller.scrollTop(posIndex * $(self.settings.innerWrapClass + ' ul li').eq(0).height() - offset);
          }
        } else {
          scroller.scrollTop(scroller[0].scrollHeight - scrollHeight);
        }
        // 重置加载flag
        timer = false;
        $.refreshScroller();
      }
    }
  };

  $.fn.listscroll = function(options) {
    this.each(function() {
      var $this = $(this);
      var listscroll = $this.data('listscroll');
      if (!listscroll) {
        listscroll = new ListScroll(this, options);
        // $this.data('listscroll', listscroll);
      }
    });
  };

  $.fn.listscroll.Constructor = ListScroll;
}));