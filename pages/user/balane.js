let App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    balance: 100,
    disabled:false,
    hasError:false,
    error:null,
    values:{},
    payment:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 充提交
   */
  submitBalance: function(e) {
    let _this = this,
    values = e.detail.value;

      console.log(values)
    if(Object.keys(values).length === 0){
      App.showError('请输入正确充值金额');
      return false;
    }
    if (_this.data.disabled) {
      return false;
    }
    _this.setData({
      balance:values.balance
    })

    if (_this.data.hasError) {
      App.showError(_this.data.error);
      return false;
    }

    // 订单创建成功后回调--微信支付
    let callback = function(result) {
      if (result.code !== 1) {
        App.showError(result.msg);
        return false;
      }
      // 发起微信支付
      wx.requestPayment({
        timeStamp: result.data.payment.timeStamp,
        nonceStr: result.data.payment.nonceStr,
        package: 'prepay_id=' + result.data.payment.prepay_id,
        signType: 'MD5',
        paySign: result.data.payment.paySign,
        success: function(res) {
          // 跳转到订单详情
          wx.navigateBack();
        },
        fail: function() {
          App.showError('取消充值', function() {
            wx.navigateBack();
          });
        },
      });
    };
    // 按钮禁用, 防止二次提交
    _this.data.disabled = true;
    // 显示loading
    wx.showLoading({
      title: '正在处理...'
    });
    App._post_form('user.balance/balance', {
      balance:_this.data.balance,
    }, function(result) {
      // success
      console.log('success');
      callback(result);
    }, function(result) {
      // fail
      console.log('fail');
    }, function() {
      // complete
      console.log('complete');
      // 解除按钮禁用
      _this.data.disabled = false;
    });
  },
})
