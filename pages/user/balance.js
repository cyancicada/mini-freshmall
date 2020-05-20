const App = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
      balance_number:""

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
        //获取当前用户余额
        App._get('user.balance/me', {}, result => {
          _this.setData({
            balance__number:  result.data.balance
          })
        });
        
    },


    /**
     * 余额列表导航跳转
     */
    onTargetMenus:function(e) {
        let _this = this;
        wx.navigateTo({
            url: '/' + e.currentTarget.dataset.url
        })
    },



})