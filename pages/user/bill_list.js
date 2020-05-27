const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: "",
    alance_detailed_list_n: false,
    title_footer: false,
    type: "",

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let _this = this;
    //获取当前用户交易记录
    App._get('user.balance/bill', {}, result => {
      console.log(result.data)
      if (result.data.length <= 0) {
        _this.setData({
          alance_detailed_list_n: true,
        })
      } else {
        _this.setData({
          height: wx.getSystemInfoSync().windowHeight - 60,
          bill_detailed_list: result.data,
          title_footer: true
        })
      }
    });


  },


  /**
   * 余额列表导航跳转
   */
  onTargetMenus: function (e) {
    let _this = this;
    console.log(e.currentTarget.dataset.url)
    wx.navigateTo({
      url: '/pages/user/bill_detailed?' + "flowing_water=" + e.currentTarget.dataset.flowing_water + "&create_time=" + e.currentTarget.dataset.create_time + "&mark=" + e.currentTarget.dataset.mark + "&trade_no=" + e.currentTarget.dataset.trade_no + "&type_name=" + e.currentTarget.dataset.type_name 
    })
  },



})