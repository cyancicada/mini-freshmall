const App = getApp();

Page({
  data: {
    // 搜索框样式
    searchColor: "rgba(0,0,0,0.4)",
    searchSize: "15",
    searchName: "搜索商品",

    // 列表高度
    scrollHeight: 0,

    // 一级分类：指针
    curNav: true,
    curIndex: 0,

    // 分类列表
    lists: [],

    // show
    notcont: false,


    showView: false,
    arrange: "",

    sortType: 'all',    // 排序类型
    sortPrice: false,   // 价格从低到高

    option: {},
    list: {},

    noList: true,
    no_more: false,

    page: 1,
    categoryId : 1,
  },

  onLoad: function(t) {
    let _this = this;
    // 设置分类列表高度
    _this.setListHeight();
    // 获取分类列表
    _this.getCategoryList();
    // 记录option
    _this.setData({ t }, function () {
      // 获取商品列表
      _this.getGoodsList(true);
    });
  },

  /**
   * 设置分类列表高度
   */
  setListHeight: function() {
    let _this = this;
    wx.getSystemInfo({
      success: function(res) {
        _this.setData({
          scrollHeight: res.windowHeight - 0,
        });
      }
    });
  },

  /**
   * 获取分类列表
   */
  getCategoryList: function() {
    let _this = this;
    App._get('category/lists', {}, function(result) {
      let data = result.data;
      _this.setData({
        lists: data.list,
        curNav: data.list.length > 0 ? data.list[0].category_id : true,
        notcont: !data.list.length
      });
      if (data.list.length > 0 ){
        _this.categoryId = data.list[0].category_id
      }
  
    });
  },

  /**
   * 一级分类：选中分类
   */
  selectNav: function(t) {
    let curNav = t.target.dataset.id,
      curIndex = parseInt(t.target.dataset.index),
      _this = this;
    _this.setData({
      curNav,
      curIndex,
      scrollTop: 0,
      page: 1,
      categoryId : curNav
    },function (page) {
      // 获取商品列表
      App._get('goods/lists', {
        page: _this.data.page || 1,
        sortType: _this.data.sortType,
        sortPrice: _this.data.sortPrice ? 1: 0,
        category_id: curNav,
        search: _this.data.option.search || '',
      }, function (result) {
          let resultList = result.data.list
            , dataList = _this.data.list;
          if (typeof dataList.data === 'undefined') {
            // typeof dataList.data === 'undefined'
            _this.setData({ list: resultList, noList: false });
          } else {
            // _this.setData({ 'list.data': dataList.data.concat(resultList.data) });
            _this.setData({ 'list.data': resultList.data });
          }
      });
    });
  },

  /**
   * 设置分享内容
   */
  onShareAppMessage: function() {
    return {
      title: "全部分类",
      path: "/pages/category/index"
    };
  },

  /**
   * 获取商品列表
   */
  getGoodsList: function (is_super, page) {
    let _this = this;
    App._get('goods/lists', {
      page: page || 1,
      sortType: _this.data.sortType,
      sortPrice: _this.data.sortPrice ? 1: 0,
      category_id: _this.categoryId,
      search: _this.data.option.search || '',
    }, function (result) {
        let resultList = result.data.list
          , dataList = _this.data.list;
        if (is_super === true || typeof dataList.data === 'undefined') {
          // typeof dataList.data === 'undefined'
          _this.setData({ list: resultList, noList: false });
        } else {
          _this.setData({ 'list.data': dataList.data.concat(resultList.data) });
        }
    });
  },
  /**
   * 切换排序方式
   */
  switchSortType: function (e) {
    let _this = this
      , newSortType = e.currentTarget.dataset.type
      , newSortPrice = newSortType === 'price' ? !_this.data.sortPrice : true;

    _this.setData({
      list: {},
      page: 1,
      sortType: newSortType,
      sortPrice: newSortPrice
    }, function () {
      // 获取商品列表
      _this.getGoodsList(true);
    });
  },
  /**
   * 下拉到底加载数据
   */
  bindDownLoad: function () {
    // 已经是最后一页
    if (this.data.page >= this.data.list.last_page) {
      this.setData({ no_more: true });
      return false;
    }
    console.log(this.data.page,33333333);
    this.getGoodsList(false, ++this.data.page);
    console.log(this.data.page,11111111);
    console.log(this.data.list.last_page,22222222);
  },
});