let App = getApp(),
  wxParse = require("../../wxParse/wxParse.js");

Page({

  data: {
    background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
    indicatorDots: true,
    vertical: true,
    autoplay: true,
    interval: 2000,
    duration: 500,
    lists : {},
    num : 0,
    page : 1,
    total : 0,
    scrollTop : 0,
    noList: true,
    no_more: false,
    scrollHeight: null,
    last_page : null,
  },

  changeIndicatorDots() {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },

  changeAutoplay() {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },

  intervalChange(e) {
    this.setData({
      interval: e.detail.value
    })
  },

  durationChange(e) {
    this.setData({
      duration: e.detail.value
    })
  },

  /**
   * 获取积分商城商品信息
   */
  onLoad() {
    let _this = this;
    // 设置商品列表高度
    _this.setListHeight();
    // 初始化数据
    _this.initData(true, _this.page);
  },


  initData(is_super, page) {
    let _this = this;
    App._get('score/lists', {
      page: page
    }, function(result) {
      // 初始化积分商城商品数据
      let data = _this.initGoodsData(result.data);
      let dataList = _this.data.lists;
      if (is_super === true || typeof dataList.data === 'undefined') {
        _this.setData(data);
      }else {
        _this.setData({ 'lists': dataList.concat(data) });
      }
    });
  },
  /**
   * 设置商品列表高度
   */
  setListHeight: function () {
    let _this = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res);
        _this.setData({
          scrollHeight: res.windowHeight - 90,
        });
      }
    });
  },

  initGoodsData(data) {
    data.total = data.total;
    data.lists = data.data;
    return data;
  },

  goTop: function(t) {
    this.setData({
      scrollTop: 0
    });
  },

  /**
   * 下拉到底加载数据
   */
  bindDownLoad: function () {
    // 已经是最后一页
    if (this.data.page >= this.data.lists.last_page) {
      this.setData({ no_more: true });
      return false;
    }
    this.initData(false, ++this.data.page);
  },

  // scroll: function(t) {
  //   this.setData({
  //     indexSearch: t.detail.scrollTop
  //   }), t.detail.scrollTop > 300 ? this.setData({
  //     floorstatus: !0
  //   }) : this.setData({
  //     floorstatus: !1
  //   });
  // },
})